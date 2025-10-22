import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { getBaseUrlApp } from "@/app/url/getBaseUrl"
import { signInUsingSocialAuth2ActionFn } from "@/auth/convex/sign_in_social/signInUsingSocialAuth2ActionFn"
import type { LoginProvider } from "@/auth/model/socialLoginProvider"
import type { UserSession } from "@/auth/model/UserSession"
import { internal } from "@convex/_generated/api"
import type { ActionCtx } from "@convex/_generated/server"
import { readEnvVariable } from "~utils/env/readEnvVariable"
import { base64urlEncodeObject } from "~utils/url/base64url"

export async function signInUsingSocialAuth1RequestHandler(
  provider: LoginProvider,
  ctx: ActionCtx,
  request: Request,
): Promise<Response> {
  const url = new URL(request.url)
  const error = url.searchParams.get("error")
  if (error) {
    return new Response("oauth returned error value: " + error, { status: 400 })
  }
  const code = url.searchParams.get("code")
  if (!code || code?.length <= 1) {
    throw new Error("missing code")
  }

  const tokenResult = await signInUsingSocialAuth2ActionFn(ctx, provider, code)
  if (!tokenResult.success) {
    throw new Error(tokenResult.errorMessage)
  }
  const userSession: UserSession = tokenResult.data

  const defaultStartPage = readEnvVariable(publicEnvVariableName.PUBLIC_SIGNED_IN_DEFAULT_PATH) ?? "/overview"
  const state = url.searchParams.get("state") || defaultStartPage

  const userSessionSerializedResult = base64urlEncodeObject(userSession)
  if (!userSessionSerializedResult.success) {
    throw new Error(userSessionSerializedResult.errorMessage)
  }
  const userSessionSerialized = userSessionSerializedResult.data

  const hostnameApp = getBaseUrlApp()
  if (!hostnameApp) throw new Error("!env.HOSTNAME_APP")
  const redirectUrl = new URL(state, hostnameApp)
  redirectUrl.searchParams.set("userSession", userSessionSerialized)
  // redirectUrl.searchParams.set("redirectUrl", state)
  console.log("user signed in", { state, redirectUrl })

  await ctx.scheduler.runAfter(0, internal.auth.notifyTelegramNewSignUpInternalAction, { userSession })

  return Response.redirect(redirectUrl.toString(), 302)
}
