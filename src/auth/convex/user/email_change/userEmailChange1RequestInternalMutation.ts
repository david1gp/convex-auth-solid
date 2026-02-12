import { vIdUser } from "@/auth/convex/vIdUser"
import { otpPurpose } from "@/auth/model_field/otpPurpose"
import type { IdUser } from "@/auth/convex/IdUser"
import { otpSaveFn } from "@/auth/convex/otp/otpSaveFn"
import { internalMutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { type PromiseResult } from "~utils/result/Result"

const userEmailChange1RequestValidator = v.object({
  userId: vIdUser,
  newEmail: v.string(),
})

export type UserEmailChange1RequestValidatorType = typeof userEmailChange1RequestValidator.type

export const userEmailChange1RequestInternalMutation = internalMutation({
  args: userEmailChange1RequestValidator,
  handler: async (ctx, args): PromiseResult<string> => {
    const otpSaveResult = await otpSaveFn(ctx, {
      userId: args.userId as IdUser,
      email: args.newEmail,
      purpose: otpPurpose.emailChange,
    })
    if (!otpSaveResult.success) return otpSaveResult
    return { success: true, data: otpSaveResult.data }
  },
})
