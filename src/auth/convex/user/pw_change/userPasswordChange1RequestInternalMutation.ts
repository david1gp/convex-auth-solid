import type { IdUser } from "@/auth/convex/IdUser"
import { otpSaveFn } from "@/auth/convex/otp/otpSaveFn"
import { vIdUser } from "@/auth/convex/vIdUser"
import { otpPurpose } from "@/auth/model_field/otpPurpose"
import { internalMutation } from "@convex/_generated/server"
import { v } from "convex/values"
import { type PromiseResult } from "~result"

const userPasswordChange1RequestValidator = v.object({
  userId: vIdUser,
  email: v.string(),
  purpose: v.string(),
})

export type UserPasswordChange1RequestValidatorType = typeof userPasswordChange1RequestValidator.type

export const userPasswordChange1RequestInternalMutation = internalMutation({
  args: userPasswordChange1RequestValidator,
  handler: async (ctx, args): PromiseResult<string> => {
    const otpSaveResult = await otpSaveFn(ctx, {
      userId: args.userId as IdUser,
      email: args.email,
      purpose: otpPurpose.passwordChange,
    })
    if (!otpSaveResult.success) return otpSaveResult
    return { success: true, data: otpSaveResult.data }
  },
})
