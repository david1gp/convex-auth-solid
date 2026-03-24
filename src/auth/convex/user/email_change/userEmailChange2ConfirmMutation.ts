import { internalMutation, mutation, type MutationCtx } from "#convex/_generated/server.js"
import { createError, type PromiseResult } from "#result"
import type { DocUser, IdUser } from "#src/auth/convex/IdUser.js"
import { saveTokenIntoSessionReturnExpiresAtFn } from "#src/auth/convex/crud/saveTokenIntoSessionReturnExpiresAtMutation.js"
import { otpConsumeFn } from "#src/auth/convex/otp/otpConsumeFn.js"
import { otpFindFn } from "#src/auth/convex/otp/otpFindFn.js"
import { docUserToUserProfile } from "#src/auth/convex/user/docUserToUserProfile.js"
import type { UserSession } from "#src/auth/model/UserSession.js"
import { loginMethod } from "#src/auth/model_field/loginMethod.js"
import { otpPurpose } from "#src/auth/model_field/otpPurpose.js"
import { createTokenResult } from "#src/auth/server/jwt_token/createTokenResult.js"
import { orgMemberGetHandleAndRoleFn } from "#src/org/member_convex/orgMemberGetHandleAndRoleInternalQuery.js"
import { authMutationTokenToUserId } from "#src/utils/convex_backend/authMutationTokenToUserId.js"
import { createErrorAndLogError } from "#src/utils/convex_backend/createErrorAndLogError.js"
import { createErrorAndLogWarn } from "#src/utils/convex_backend/createErrorAndLogWarn.js"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.js"
import { createUserIdValidator } from "#src/utils/convex_backend/createUserIdValidator.js"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"

const userEmailChange2ConfirmFieldsBase = {
  newEmail: v.string(),
  confirmationCode: v.string(),
} as const

export const userEmailChange2ConfirmValidatorInternal = createUserIdValidator(userEmailChange2ConfirmFieldsBase)
export type UserEmailChangeConfirmTypeInternal = typeof userEmailChange2ConfirmValidatorInternal.type

export const userEmailChange2ConfirmValidatorPublic = createTokenValidator(userEmailChange2ConfirmFieldsBase)
export type UserEmailChangeConfirmTypePublic = typeof userEmailChange2ConfirmValidatorPublic.type

export const userEmailChange2ConfirmMutation = mutation({
  args: userEmailChange2ConfirmValidatorPublic,
  handler: async (ctx, args) => authMutationTokenToUserId(ctx, args, userEmailChange2ConfirmFn),
})

export const userEmailChange2ConfirmInternalMutation = internalMutation({
  args: userEmailChange2ConfirmValidatorInternal,
  handler: async (ctx, args) => userEmailChange2ConfirmFn(ctx, args),
})

async function userEmailChange2ConfirmFn(
  ctx: MutationCtx,
  args: UserEmailChangeConfirmTypeInternal,
): PromiseResult<UserSession> {
  const op = "userEmailChange2ConfirmFn"

  const userId = args.userId as IdUser
  const user: DocUser | null = await ctx.db.get("users", userId)
  if (!user) {
    return createErrorAndLogError(op, "User not found")
  }

  const otpFindResult = await otpFindFn(ctx, {
    email: args.newEmail,
    code: args.confirmationCode,
    purpose: otpPurpose.emailChange,
  })
  if (!otpFindResult.success) {
    return createErrorAndLogWarn(op, otpFindResult.errorMessage)
  }
  const otpRecord = otpFindResult.data

  await otpConsumeFn(ctx, { otpId: otpRecord._id })

  await ctx.db.patch("users", userId, {
    email: args.newEmail,
    emailVerifiedAt: nowIso(),
    updatedAt: nowIso(),
  })

  const { orgHandle, orgRole } = await orgMemberGetHandleAndRoleFn(ctx, userId)
  const userProfile = docUserToUserProfile(user as DocUser, orgHandle, orgRole)
  const tokenResult = await createTokenResult(userId, orgHandle, orgRole)
  if (!tokenResult.success) return createError(op, tokenResult.errorMessage)
  const token = tokenResult.data
  const expiresAt = await saveTokenIntoSessionReturnExpiresAtFn(ctx, loginMethod.email, userId, token)
  const userSession: UserSession = {
    token,
    profile: userProfile,
    hasPw: !!user.hashedPassword,
    signedInMethod: loginMethod.email,
    signedInAt: nowIso(),
    expiresAt,
  }

  return { success: true, data: userSession }
}
