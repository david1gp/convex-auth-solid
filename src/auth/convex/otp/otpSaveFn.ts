import { vIdUser } from "@/auth/convex/vIdUser"
import { otpPurposeValidator } from "@/auth/model_field/otpPurpose"
import type { IdUser } from "@/auth/convex/IdUser"
import type { OtpPurpose } from "@/auth/model_field/otpPurpose"
import { generateOtpCode } from "@/auth/convex/pw/generateOtpCode"
import { internalMutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { type PromiseResult } from "~utils/result/Result"

export const otpSaveInternalMutation = internalMutation({
  args: {
    userId: vIdUser,
    email: v.string(),
    purpose: otpPurposeValidator,
  },
  handler: otpSaveFn,
})

export async function otpSaveFn(
  ctx: MutationCtx,
  args: { userId: IdUser; email: string; purpose: OtpPurpose },
): PromiseResult<string> {
  const op = "otpSaveFn"
  const { userId, email, purpose } = args

  const code = generateOtpCode()

  await ctx.db.insert("authOtps", {
    userId,
    name: "",
    email,
    code,
    purpose,
    createdAt: nowIso(),
    consumedAt: undefined,
  })

  return { success: true, data: code }
}
