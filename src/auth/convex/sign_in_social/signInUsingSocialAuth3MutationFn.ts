import type { IdUser } from "@/auth/convex/IdUser"
import type { UserSession } from "@/auth/model/UserSession"
import { createTokenResult } from "@/auth/server/jwt_token/createTokenResult"
import { type CommonAuthProvider } from "@/auth/server/social_identity_providers/CommonAuthProvider.js"
import { orgMemberGetHandleAndRoleFn } from "@/org/member_convex/orgMemberGetHandleAndRoleFn"
import type { Id } from "@convex/_generated/dataModel"
import { type MutationCtx } from "@convex/_generated/server.js"
import { createResult, type PromiseResult } from "~utils/result/Result"
import { findOrCreateUserFn } from "../crud/findOrCreateUserFn"
import { saveTokenIntoSessionReturnExpiresAtFn } from "../crud/saveTokenIntoSessionReturnExpiresAtFn"

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
  const data = foundOrCreatedResult.data
  const userId = data.user.userId as IdUser

  // Check for org membership
  const { orgHandle, orgRole } = await orgMemberGetHandleAndRoleFn(ctx, userId)

  // data
  const tokenResult = await createTokenResult(userId, orgHandle, orgRole)
  if (!tokenResult.success) return tokenResult
  const token = tokenResult.data
  await saveTokenIntoSessionReturnExpiresAtFn(ctx, providerInfo.provider, userId as Id<"users">, token)
  // event
  const r: UserSession = {
    token,
    ...data,
  }
  return createResult(r)
}
