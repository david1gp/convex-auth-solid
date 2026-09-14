import type { ActionCtx } from "#convex/_generated/server.js"
import { createResultError } from "#result"
import { enableGithub } from "#src/app/config/enableGithub.ts"
import { enableSignInDev } from "#src/app/config/enableSignInDev.ts"
import { signInCallbackCompletionResponseCreate } from "#src/auth/convex/sign_in_shared/signInCallbackCompletionResponseCreate.ts"
import { signInUsingSocialAuth2ActionFn } from "#src/auth/convex/sign_in_social/signInUsingSocialAuth2ActionFn.ts"
import type { UserSession } from "#src/auth/model/UserSession.ts"
import { type LoginProvider, loginProvider } from "#src/auth/model_field/socialLoginProvider.ts"
import { getDefaultUrlSignedIn } from "#src/auth/url/getDefaultUrlSignedIn.ts"
import { jsonStringifyPretty } from "#utils/json/jsonStringifyPretty.js"

export async function signInUsingSocialAuth1RequestHandler(
  provider: Exclude<LoginProvider, typeof loginProvider.oidc>,
  ctx: ActionCtx,
  request: Request,
): Promise<Response> {
  const op = "signInUsingSocialAuth1RequestHandler"
  const url = new URL(request.url)
  const error = url.searchParams.get("error")
  if (error) {
    const errorMessage = `oauth returned error value: ${error}`
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
  return signInCallbackCompletionResponseCreate(ctx, userSession, state, "oauth")
}
