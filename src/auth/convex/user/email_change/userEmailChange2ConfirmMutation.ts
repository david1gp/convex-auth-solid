import type { DocUser, IdUser } from "@/auth/convex/IdUser"
import { saveTokenIntoSessionReturnExpiresAtFn } from "@/auth/convex/crud/saveTokenIntoSessionReturnExpiresAtMutation"
import { otpConsumeFn } from "@/auth/convex/otp/otpConsumeFn"
import { otpFindFn } from "@/auth/convex/otp/otpFindFn"
import { docUserToUserProfile } from "@/auth/convex/user/docUserToUserProfile"
import type { UserSession } from "@/auth/model/UserSession"
import { loginMethod } from "@/auth/model_field/loginMethod"
import { otpPurpose } from "@/auth/model_field/otpPurpose"
import { createTokenResult } from "@/auth/server/jwt_token/createTokenResult"
import { orgMemberGetHandleAndRoleFn } from "@/org/member_convex/orgMemberGetHandleAndRoleInternalQuery"
import { authMutationTokenToUserId } from "../../../../../convex/utils/authMutationTokenToUserId"
import { createErrorAndLogError } from "../../../../../convex/utils/createErrorAndLogError"
import { createErrorAndLogWarn } from "../../../../../convex/utils/createErrorAndLogWarn"
import { createTokenValidator } from "../../../../../convex/utils/createTokenValidator"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { createError, type PromiseResult } from "~utils/result/Result"

const userEmailChange2ConfirmFieldsBase = {
  newEmail: v.string(),
  confirmationCode: v.string(),
} as const

export const userEmailChange2ConfirmValidatorInternal = v.object({
  ...userEmailChange2ConfirmFieldsBase,
  userId: v.id("users"),
})
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
  const user: DocUser | null = await ctx.db.get(userId)
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

  await ctx.db.patch(userId, {
    email: args.newEmail,
    emailVerifiedAt: nowIso(),
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
