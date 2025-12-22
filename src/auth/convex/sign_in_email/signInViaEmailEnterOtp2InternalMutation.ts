import { saveTokenIntoSessionReturnExpiresAtFn } from "@/auth/convex/crud/saveTokenIntoSessionReturnExpiresAtMutation"
import type { UserSession } from "@/auth/model/UserSession"
import { loginMethod } from "@/auth/model_field/loginMethod"
import { createTokenResult } from "@/auth/server/jwt_token/createTokenResult"
import { orgMemberGetHandleAndRoleFn } from "@/org/member_convex/orgMemberGetHandleAndRoleInternalQuery"
import { internalMutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"
import type { DocUser } from "../IdUser"
import { docUserToUserProfile } from "../user/docUserToUserProfile"

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

  //
  // 1. Find the login code
  //
  const loginCode = await ctx.db
    .query("authEmailLoginCodes")
    .withIndex("emailCode", (q) => q.eq("email", email).eq("code", code))
    .first()

  if (!loginCode) {
    return createError(op, "Invalid or expired code", code)
  }

  if (loginCode.consumedAt) {
    return createError(op, "Code already used", code)
  }

  const { userId } = loginCode

  //
  // 2. Get user
  //
  const user = await ctx.db.get(userId)
  if (!user) {
    return createError(op, "User not found", userId)
  }

  //
  // 3. Check for org membership
  //
  const { orgHandle, orgRole } = await orgMemberGetHandleAndRoleFn(ctx, userId)

  const userProfile = docUserToUserProfile(user as DocUser, orgHandle, orgRole)

  //
  // 4. Create session
  //
  const tokenResult = await createTokenResult(userId, orgHandle, orgRole)
  if (!tokenResult.success) return tokenResult
  const token = tokenResult.data

  const expiresAt = await saveTokenIntoSessionReturnExpiresAtFn(ctx, loginMethod.email, userId, token)

  //
  // 5. Mark code as consumed
  //
  await ctx.db.patch(loginCode._id, { consumedAt: nowIso() })

  //
  // 6. Create and return user session
  //
  const userSession: UserSession = {
    token,
    profile: userProfile,
    hasPw: !!user.hashedPassword,
    signedInMethod: loginMethod.email,
    signedInAt: nowIso(),
    expiresAt,
  }

  return createResult(userSession)
}
