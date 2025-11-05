import { type MutationCtx, internalMutation } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"
import { findUserByEmailFn } from "../crud/findUserByEmailQuery"
import type { IdUser } from "../IdUser"
import { generateOtpCode } from "../pw/generateOtpCode"

export type SignInViaEmailSaveCodeValidatorType = typeof signInViaEmailSaveCodeValidator.type
export const signInViaEmailSaveCodeValidator = v.object({
  email: v.string(),
})

export const signInViaEmail2InternalMutation = internalMutation({
  args: signInViaEmailSaveCodeValidator,
  handler: signInViaEmail2InternalMutationFn,
})

export async function signInViaEmail2InternalMutationFn(
  ctx: MutationCtx,
  args: SignInViaEmailSaveCodeValidatorType,
): PromiseResult<string> {
  const op = "signInEmailSaveCode2MutationFn"
  const { email } = args

  // Find user
  const user = await findUserByEmailFn(ctx, email)
  if (!user) {
    return createError(op, "User not found")
  }

  const userId = user._id as IdUser

  // Check if recent code exists and not consumed
  const recentCodes = await ctx.db
    .query("authEmailLoginCodes")
    .withIndex("emailCode", (q) => q.eq("email", email))
    .filter((q) => q.eq(q.field("userId"), userId))
    .filter((q) => q.eq(q.field("consumedAt"), undefined))
    .collect()

  if (recentCodes.length > 0) {
    // Delete old unconsumed codes
    for (const code of recentCodes) {
      await ctx.db.delete(code._id)
    }
  }

  // Generate new code
  const code = generateOtpCode()

  // Insert code
  await ctx.db.insert("authEmailLoginCodes", {
    userId,
    code,
    email,
    createdAt: nowIso(),
    consumedAt: undefined,
  })

  return createResult(code)
}
