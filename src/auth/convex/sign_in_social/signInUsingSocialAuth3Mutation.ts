import { createResult, type PromiseResult } from "#result"
import { findOrCreateUserFn } from "#src/auth/convex/crud/findOrCreateUserFn.js"
import { saveTokenIntoSessionReturnExpiresAtFn } from "#src/auth/convex/crud/saveTokenIntoSessionReturnExpiresAtMutation.js"
import type { IdUser } from "#src/auth/convex/IdUser.js"
import type { UserSession } from "#src/auth/model/UserSession.js"
import { createTokenResult } from "#src/auth/server/jwt_token/createTokenResult.js"
import {
    type CommonAuthProvider,
    commonAuthProviderValidator,
} from "#src/auth/server/social_identity_providers/CommonAuthProvider.js.js"
import { orgMemberGetHandleAndRoleFn } from "#src/org/member_convex/orgMemberGetHandleAndRoleInternalQuery.js"
import { internalMutation, type MutationCtx } from "@convex/_generated/server.js.js"

export const signInUsingSocialAuth3InternalMutation = internalMutation({
  args: commonAuthProviderValidator,
  handler: signInUsingSocialAuth3MutationFn,
})

export async function signInUsingSocialAuth3MutationFn(
  ctx: MutationCtx,
  providerInfo: CommonAuthProvider,
): PromiseResult<UserSession> {
  const op = "signInUsingSocialAuthMutationFn"
  // Find or create user
  const foundOrCreatedResult = await findOrCreateUserFn(ctx, providerInfo)
  if (!foundOrCreatedResult.success) {
    console.log("failed to find user", foundOrCreatedResult.errorMessage)
    return foundOrCreatedResult
  }
  const userWithoutToken = foundOrCreatedResult.data
  const userId = userWithoutToken.profile.userId as IdUser

  // Check for org membership
  const { orgHandle, orgRole } = await orgMemberGetHandleAndRoleFn(ctx, userId)

  // data
  const tokenResult = await createTokenResult(userId, orgHandle, orgRole)
  if (!tokenResult.success) return tokenResult
  const token = tokenResult.data
  await saveTokenIntoSessionReturnExpiresAtFn(ctx, providerInfo.provider, userId as IdUser, token)
  // event
  const r: UserSession = {
    token,
    ...userWithoutToken,
  }
  return createResult(r)
}
