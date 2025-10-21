import { type MutationCtx } from "@convex/_generated/server"
import { saveTokenIntoSessionReturnExpiresAtFn } from "@convex/auth/crud/saveTokenIntoSessionReturnExpiresAtFn"
import { v } from "convex/values"
import { privateEnvVariableName } from "~auth/env/privateEnvVariableName"
import type { UserSession } from "~auth/model/UserSession"
import { loginMethod } from "~auth/model/loginMethod"
import { createToken } from "~auth/server/jwt_token/createToken"
import { nowIso } from "~utils/date/nowIso"
import { readEnvVariableResult } from "~utils/env/readEnvVariable"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"
import type { DocUser } from "../IdUser"
import { dbUsersToUserProfile } from "../crud/dbUsersToUserProfile"

export type signInViaEmailEnterOtp2ValidatorType = typeof signInViaEmailEnterOtp2Validator.type
export const signInViaEmailEnterOtp2Validator = v.object({
  email: v.string(),
  code: v.string(),
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
  const userProfile = dbUsersToUserProfile(user as DocUser)

  //
  // 3. Create session
  //
  const saltResult = readEnvVariableResult(privateEnvVariableName.AUTH_SECRET)
  if (!saltResult.success) return saltResult
  const salt = saltResult.data
  const token = await createToken(userId, salt)
  const expiresAt = await saveTokenIntoSessionReturnExpiresAtFn(ctx, loginMethod.email, userId, token)

  //
  // 4. Mark code as consumed
  //
  await ctx.db.patch(loginCode._id, { consumedAt: nowIso() })

  //
  // 5. Create and return user session
  //
  const userSession: UserSession = {
    token,
    user: userProfile,
    signedInMethod: loginMethod.email,
    signedInAt: nowIso(),
    expiresAt,
  }

  return createResult(userSession)
}
