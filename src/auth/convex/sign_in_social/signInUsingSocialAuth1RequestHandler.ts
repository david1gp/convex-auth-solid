import { enableGithub } from "@/app/config/enableGithub"
import { enableSignInDev } from "@/app/config/enableSignInDev"
import { envBaseUrlAppResult } from "@/app/env/public/envBaseUrlAppResult"
import { signInUsingSocialAuth2ActionFn } from "@/auth/convex/sign_in_social/signInUsingSocialAuth2ActionFn"
import type { UserSession } from "@/auth/model/UserSession"
import { loginProvider, type LoginProvider } from "@/auth/model_field/socialLoginProvider"
import { getDefaultUrlSignedIn } from "@/auth/url/getDefaultUrlSignedIn"
import { internal } from "@convex/_generated/api"
import type { ActionCtx } from "@convex/_generated/server"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"
import { createResultError } from "~utils/result/Result"
import { base64urlEncodeObject } from "~utils/url/base64url"

export async function signInUsingSocialAuth1RequestHandler(
  provider: LoginProvider,
  ctx: ActionCtx,
  request: Request,
): Promise<Response> {
  const op = "signInUsingSocialAuth1RequestHandler"
  const url = new URL(request.url)
  const error = url.searchParams.get("error")
  if (error) {
    const errorMessage = "oauth returned error value: " + error
    const err = createResultError(op, errorMessage)
    console.warn(err)
    return new Response(jsonStringifyPretty(err), { status: 400 })
  }

  if (provider === loginProvider.github && !enableGithub()) {
    const errorMessage = "Github provider disabled"
    const err = createResultError(op, errorMessage)
    console.warn(err)
    return new Response(jsonStringifyPretty(err), { status: 400 })
  }

  if (provider === loginProvider.dev && !enableSignInDev()) {
    const errorMessage = "Dev provider disabled"
    const err = createResultError(op, errorMessage)
    console.warn(err)
    return new Response(jsonStringifyPretty(err), { status: 400 })
  }

  const code = url.searchParams.get("code")
  if (!code || code?.length <= 1) {
    const errorMessage = "missing code"
    const err = createResultError(op, errorMessage)
    console.warn(err)
    return new Response(jsonStringifyPretty(err), { status: 400 })
  }

  const tokenResult = await signInUsingSocialAuth2ActionFn(ctx, provider, code)
  if (!tokenResult.success) {
    console.warn(tokenResult)
    return new Response(jsonStringifyPretty(tokenResult), { status: 400 })
  }
  const userSession: UserSession = tokenResult.data

  const defaultStartPage = getDefaultUrlSignedIn()
  const state = url.searchParams.get("state") || defaultStartPage

  const userSessionSerializedResult = base64urlEncodeObject(userSession)
  if (!userSessionSerializedResult.success) {
    console.warn(userSessionSerializedResult)
    return new Response(jsonStringifyPretty(userSessionSerializedResult), { status: 400 })
  }
  const userSessionSerialized = userSessionSerializedResult.data

  const hostnameAppResult = envBaseUrlAppResult()
  if (!hostnameAppResult.success) {
    console.error(hostnameAppResult)
    return new Response(jsonStringifyPretty(hostnameAppResult), { status: 500 })
  }
  const hostnameApp = hostnameAppResult.data
  const redirectUrl = new URL(state, hostnameApp)
  redirectUrl.searchParams.set("userSession", userSessionSerialized)
  // redirectUrl.searchParams.set("redirectUrl", state)
  console.log("user signed in", { state, redirectUrl })

  await ctx.scheduler.runAfter(0, internal.auth.notifyTelegramNewSignUpInternalAction, { userSession })

  return Response.redirect(redirectUrl.toString(), 302)
}
