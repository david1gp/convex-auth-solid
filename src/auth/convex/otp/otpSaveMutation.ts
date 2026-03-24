import { internalMutation } from "#convex/_generated/server.js"
import { type PromiseResult } from "#result"
import { generateOtpCode } from "#src/auth/convex/pw/generateOtpCode.js"
import { vIdUser } from "#src/auth/convex/vIdUser.js"
import { otpPurposeValidator } from "#src/auth/model_field/otpPurpose.js"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"

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
