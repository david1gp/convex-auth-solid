import { internalMutation } from "#convex/_generated/server.js"
import { type PromiseResult } from "#result"
import type { IdUser } from "#src/auth/convex/IdUser.js"
import { otpSaveFn } from "#src/auth/convex/otp/otpSaveFn.js"
import { vIdUser } from "#src/auth/convex/vIdUser.js"
import { otpPurpose } from "#src/auth/model_field/otpPurpose.js"
import { v } from "convex/values"

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
