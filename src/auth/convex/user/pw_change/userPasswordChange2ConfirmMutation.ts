import { internalMutation, mutation, type MutationCtx } from "#convex/_generated/server.js"
import { createError, type PromiseResult } from "#result"
import type { DocUser, IdUser } from "#src/auth/convex/IdUser.js"
import { saveTokenIntoSessionReturnExpiresAtFn } from "#src/auth/convex/crud/saveTokenIntoSessionReturnExpiresAtMutation.js"
import { otpConsumeFn } from "#src/auth/convex/otp/otpConsumeFn.js"
import { otpFindFn } from "#src/auth/convex/otp/otpFindFn.js"
import { hashPassword2 } from "#src/auth/convex/pw/hashPassword.js"
import { docUserToUserProfile } from "#src/auth/convex/user/docUserToUserProfile.js"
import type { UserSession } from "#src/auth/model/UserSession.js"
import { loginMethod } from "#src/auth/model_field/loginMethod.js"
import { otpPurpose } from "#src/auth/model_field/otpPurpose.js"
import { passwordSchema } from "#src/auth/model_field/passwordSchema.js"
import { createTokenResult } from "#src/auth/server/jwt_token/createTokenResult.js"
import { orgMemberGetHandleAndRoleFn } from "#src/org/member_convex/orgMemberGetHandleAndRoleInternalQuery.js"
import { authMutationTokenToUserId } from "#src/utils/convex_backend/authMutationTokenToUserId.js"
import { createErrorAndLogError } from "#src/utils/convex_backend/createErrorAndLogError.js"
import { createErrorAndLogWarn } from "#src/utils/convex_backend/createErrorAndLogWarn.js"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.js"
import { createUserIdValidator } from "#src/utils/convex_backend/createUserIdValidator.js"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"
import * as a from "valibot"

const userPasswordChange2ConfirmFieldsBase = {
  newPassword: v.string(),
  confirmationCode: v.string(),
} as const

export const userPasswordChange2ConfirmValidatorInternal = createUserIdValidator(userPasswordChange2ConfirmFieldsBase)
export type UserPasswordChangeConfirmTypeInternal = typeof userPasswordChange2ConfirmValidatorInternal.type

export const userPasswordChange2ConfirmValidatorPublic = createTokenValidator(userPasswordChange2ConfirmFieldsBase)
export type UserPasswordChangeConfirmTypePublic = typeof userPasswordChange2ConfirmValidatorPublic.type

export const userPasswordChange2ConfirmMutation = mutation({
  args: userPasswordChange2ConfirmValidatorPublic,
  handler: async (ctx, args) => authMutationTokenToUserId(ctx, args, userPasswordChange2ConfirmFn),
})

export const userPasswordChange2ConfirmInternalMutation = internalMutation({
  args: userPasswordChange2ConfirmValidatorInternal,
  handler: async (ctx, args) => userPasswordChange2ConfirmFn(ctx, args),
})

async function userPasswordChange2ConfirmFn(
  ctx: MutationCtx,
  args: UserPasswordChangeConfirmTypeInternal,
): PromiseResult<UserSession> {
  const op = "userPasswordChange2ConfirmFn"

  const newPasswordValidation = a.safeParse(passwordSchema, args.newPassword)
  if (!newPasswordValidation.success) {
    return createErrorAndLogWarn(op, newPasswordValidation.issues[0].message)
  }

  const userId = args.userId as IdUser
  const user: DocUser | null = await ctx.db.get("users", userId)
  if (!user) {
    return createErrorAndLogError(op, "User not found")
  }

  if (!user.email) {
    return createErrorAndLogError(op, "User email not found")
  }

  const otpFindResult = await otpFindFn(ctx, {
    email: user.email,
    code: args.confirmationCode,
    purpose: otpPurpose.passwordChange,
  })
  if (!otpFindResult.success) {
    return createErrorAndLogWarn(op, otpFindResult.errorMessage)
  }
  const otpRecord = otpFindResult.data

  await otpConsumeFn(ctx, { otpId: otpRecord._id })

  const newPasswordHash = await hashPassword2(args.newPassword)
  if (!newPasswordHash.success) {
    return createErrorAndLogError(op, newPasswordHash.errorMessage || "Password hashing failed")
  }

  await ctx.db.patch("users", userId, {
    hashedPassword: newPasswordHash.data,
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
