import { type MutationCtx, internalMutation } from "@convex/_generated/server"
import { v } from "convex/values"
import { createError, type PromiseResult } from "~utils/result/Result"
import { findUserByEmailFn } from "@/auth/convex/crud/findUserByEmailQuery"
import type { IdUser } from "@/auth/convex/IdUser"
import { otpSaveFn } from "@/auth/convex/otp/otpSaveFn"
import { otpPurpose } from "@/auth/model_field/otpPurpose"

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

  const user = await findUserByEmailFn(ctx, email)
  if (!user) {
    return createError(op, "User not found")
  }

  const userId = user._id as IdUser

  const saveResult = await otpSaveFn(ctx, { userId, email, purpose: otpPurpose.signIn })
  if (!saveResult.success) return saveResult

  return { success: true, data: saveResult.data }
}
