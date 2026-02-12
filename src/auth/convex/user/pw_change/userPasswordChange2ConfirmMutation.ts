import type { DocUser, IdUser } from "@/auth/convex/IdUser"
import { saveTokenIntoSessionReturnExpiresAtFn } from "@/auth/convex/crud/saveTokenIntoSessionReturnExpiresAtMutation"
import { otpConsumeFn } from "@/auth/convex/otp/otpConsumeFn"
import { otpFindFn } from "@/auth/convex/otp/otpFindFn"
import { hashPassword2 } from "@/auth/convex/pw/hashPassword"
import { docUserToUserProfile } from "@/auth/convex/user/docUserToUserProfile"
import type { UserSession } from "@/auth/model/UserSession"
import { loginMethod } from "@/auth/model_field/loginMethod"
import { otpPurpose } from "@/auth/model_field/otpPurpose"
import { passwordSchema } from "@/auth/model_field/passwordSchema"
import { createTokenResult } from "@/auth/server/jwt_token/createTokenResult"
import { orgMemberGetHandleAndRoleFn } from "@/org/member_convex/orgMemberGetHandleAndRoleInternalQuery"
import { authMutationTokenToUserId } from "../../../../../convex/utils/authMutationTokenToUserId"
import { createErrorAndLogError } from "../../../../../convex/utils/createErrorAndLogError"
import { createErrorAndLogWarn } from "../../../../../convex/utils/createErrorAndLogWarn"
import { createTokenValidator } from "../../../../../convex/utils/createTokenValidator"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import * as a from "valibot"
import { nowIso } from "~utils/date/nowIso"
import { createError, type PromiseResult } from "~utils/result/Result"

const userPasswordChange2ConfirmFieldsBase = {
  newPassword: v.string(),
  confirmationCode: v.string(),
} as const

export const userPasswordChange2ConfirmValidatorInternal = v.object({
  ...userPasswordChange2ConfirmFieldsBase,
  userId: v.id("users"),
})
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
  const user: DocUser | null = await ctx.db.get(userId)
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

  await ctx.db.patch(userId, {
    hashedPassword: newPasswordHash.data,
    updatedAt: nowIso(),
  })

  const { orgHandle, orgRole } = await orgMemberGetHandleAndRoleFn(ctx, userId)
  const userProfile = docUserToUserProfile(user as DocUser, orgHandle, orgRole)
  const tokenResult = await createTokenResult(userId, orgHandle, orgRole)
  if (!tokenResult.success) return createError(op, tokenResult.errorMessage)
  const token = tokenResult.data
  const expiresAt = await saveTokenIntoSessionReturnExpiresAtFn(ctx, loginMethod.email, userId, token, nowIso())
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
