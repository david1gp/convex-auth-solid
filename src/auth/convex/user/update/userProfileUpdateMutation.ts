import { saveTokenIntoSessionReturnExpiresAtFn } from "@/auth/convex/crud/saveTokenIntoSessionReturnExpiresAtMutation"
import type { DocUser, IdUser } from "@/auth/convex/IdUser"
import { docUserToUserProfile } from "@/auth/convex/user/docUserToUserProfile"
import {
  type UserProfileFieldsTypeInternal,
  userProfileFieldsBase,
} from "@/auth/convex/user/update/userProfileUpdateMutationInternal"
import type { UserProfile } from "@/auth/model/UserProfile"
import type { UserSession } from "@/auth/model/UserSession"
import { loginMethod } from "@/auth/model_field/loginMethod"
import { createTokenResult } from "@/auth/server/jwt_token/createTokenResult"
import { orgMemberGetHandleAndRoleFn } from "@/org/member_convex/orgMemberGetHandleAndRoleInternalQuery"
import type { OrgRole } from "@/org/org_model_field/orgRole"
import { type MutationCtx, mutation } from "@convex/_generated/server"
import { authMutationTokenToUserId } from "@/utils/convex_backend/authMutationTokenToUserId"
import { createErrorAndLogError } from "@/utils/convex_backend/createErrorAndLogError"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { nowIso } from "~utils/date/nowIso"
import { type PromiseResult, createResult } from "~utils/result/Result"

export const userProfileFieldsValidatorPublic = createTokenValidator(userProfileFieldsBase)
export type UserProfileFieldsTypePublic = typeof userProfileFieldsValidatorPublic.type

export const userProfileUpdateMutation = mutation({
  args: userProfileFieldsValidatorPublic,
  handler: async (ctx, args) => authMutationTokenToUserId(ctx, args, userProfileUpdatePublicFn),
})

async function userProfileUpdatePublicFn(
  ctx: MutationCtx,
  args: UserProfileFieldsTypeInternal,
): PromiseResult<UserSession | null> {
  const op = "userProfileUpdatePublicFn"
  const userId = args.userId

  const currentUser: DocUser | null = await ctx.db.get(userId)
  if (!currentUser) {
    return createErrorAndLogError(op, "User not found", userId)
  }

  const nameChanged = args.name !== currentUser.name
  const imageChanged = args.image !== currentUser.image

  if (!nameChanged && !imageChanged) {
    return createResult(null)
  }

  await ctx.db.patch(userId, {
    ...(nameChanged && { name: args.name }),
    ...(imageChanged && { image: args.image }),
    updatedAt: nowIso(),
  })

  const updatedUser = await ctx.db.get(userId)
  if (!updatedUser) {
    return createErrorAndLogError(op, "User not found after update")
  }

  const { orgHandle, orgRole } = await orgMemberGetHandleAndRoleFn(ctx, userId)
  const userProfile = docUserToUserProfile(updatedUser, orgHandle, orgRole)
  return createUserSessionResult(ctx, userId, userProfile, loginMethod.email, orgHandle, orgRole)
}

async function createUserSessionResult(
  ctx: MutationCtx,
  userId: IdUser,
  userProfile: UserProfile,
  signedInMethod: typeof loginMethod.email,
  orgHandle?: string,
  orgRole?: OrgRole,
): PromiseResult<UserSession> {
  const op = "createUserSessionResult"

  const tokenResult = await createTokenResult(userId, orgHandle, orgRole)
  if (!tokenResult.success) {
    return tokenResult
  }
  const token = tokenResult.data

  const expiresAt = await saveTokenIntoSessionReturnExpiresAtFn(ctx, signedInMethod, userId, token, nowIso())

  const userSession: UserSession = {
    token,
    profile: userProfile,
    hasPw: !!userProfile.email,
    signedInMethod,
    signedInAt: nowIso(),
    expiresAt,
  }

  return createResult(userSession)
}
