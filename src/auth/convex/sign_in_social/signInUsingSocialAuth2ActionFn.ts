import type { UserSession } from "@/auth/model/UserSession"
import type { LoginProvider } from "@/auth/model_field/socialLoginProvider"
import type { CommonAuthProvider } from "@/auth/server/social_identity_providers/CommonAuthProvider"
import { socialLoginGetUserProfile } from "@/auth/server/social_identity_providers/socialLoginGetUserProfile"
import { internal } from "@convex/_generated/api"
import type { ActionCtx } from "@convex/_generated/server"
import type { PromiseResult } from "~utils/result/Result"

export async function signInUsingSocialAuth2ActionFn(
  ctx: ActionCtx,
  provider: LoginProvider,
  code: string,
): PromiseResult<UserSession> {
  const op = "signInUsingSocialAuth"

  // Download oauth provider data
  const providerInfoOrError = await socialLoginGetUserProfile[provider](code)
  console.log({ op, providerInfoOrError })
  if (!providerInfoOrError.success) {
    console.log("eventFailedLoginAttemptViaSocial", providerInfoOrError.errorMessage)
    return providerInfoOrError
  }
  const providerInfo: CommonAuthProvider = providerInfoOrError.data

  // Find or create user, create token
  return ctx.runMutation(internal.auth.signInUsingSocialAuth3InternalMutation, providerInfo)
}
