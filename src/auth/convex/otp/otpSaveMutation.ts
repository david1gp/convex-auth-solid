import { generateOtpCode } from "@/auth/convex/pw/generateOtpCode"
import { vIdUser } from "@/auth/convex/vIdUser"
import { otpPurposeValidator } from "@/auth/model_field/otpPurpose"
import { internalMutation } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { type PromiseResult } from "~utils/result/Result"

export const otpSaveInternalMutation = internalMutation({
  args: {
    userId: vIdUser,
    email: v.string(),
    purpose: otpPurposeValidator,
  },
  handler: async (ctx, args): PromiseResult<string> => {
    const code = generateOtpCode()

    await ctx.db.insert("authOtps", {
      userId: args.userId,
      name: "",
      email: args.email,
      code,
      purpose: args.purpose,
      createdAt: nowIso(),
      consumedAt: undefined,
    })

    return { success: true, data: code }
  },
})
