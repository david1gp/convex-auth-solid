import { saveTokenIntoSessionReturnExpiresAtFn } from "@/auth/convex/crud/saveTokenIntoSessionReturnExpiresAtMutation"
import type { DocUser } from "@/auth/convex/IdUser"
import { docUserToUserProfile } from "@/auth/convex/user/docUserToUserProfile"
import type { UserSession } from "@/auth/model/UserSession"
import { loginMethod } from "@/auth/model_field/loginMethod"
import { otpPurpose } from "@/auth/model_field/otpPurpose"
import { createTokenResult } from "@/auth/server/jwt_token/createTokenResult"
import { orgMemberGetHandleAndRoleFn } from "@/org/member_convex/orgMemberGetHandleAndRoleInternalQuery"
import { internalMutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { createError, type PromiseResult } from "~utils/result/Result"
import { otpConsumeFn } from "@/auth/convex/otp/otpConsumeFn"
import { otpFindFn } from "@/auth/convex/otp/otpFindFn"

export type signInViaEmailEnterOtp2ValidatorType = typeof signInViaEmailEnterOtp2Validator.type
export const signInViaEmailEnterOtp2Validator = v.object({
  email: v.string(),
  code: v.string(),
})

export const signInViaEmailEnterOtp2InternalMutation = internalMutation({
  args: signInViaEmailEnterOtp2Validator,
  handler: signInViaEmailEnterOtp2InternalMutationFn,
})

export async function signInViaEmailEnterOtp2InternalMutationFn(
  ctx: MutationCtx,
  args: signInViaEmailEnterOtp2ValidatorType,
): PromiseResult<UserSession> {
  const op = "signInConfirm2MutationFn"
  const { email, code } = args

  const otpFindResult = await otpFindFn(ctx, { email, code, purpose: otpPurpose.signIn })
  if (!otpFindResult.success) {
    return createError(op, otpFindResult.errorMessage || "Invalid code")
  }
  const otpRecord = otpFindResult.data

  const { userId } = otpRecord

  const user = await ctx.db.get("users", userId)
  if (!user) {
    return createError(op, "User not found", userId)
  }

  const { orgHandle, orgRole } = await orgMemberGetHandleAndRoleFn(ctx, userId)

  const userProfile = docUserToUserProfile(user as DocUser, orgHandle, orgRole)

  const tokenResult = await createTokenResult(userId, orgHandle, orgRole)
  if (!tokenResult.success) return tokenResult
  const token = tokenResult.data

  const expiresAt = await saveTokenIntoSessionReturnExpiresAtFn(ctx, loginMethod.email, userId, token)

  await otpConsumeFn(ctx, { otpId: otpRecord._id })

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
