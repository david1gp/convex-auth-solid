import type { IdUser } from "@/auth/convex/IdUser"
import { generateOtpCode } from "@/auth/convex/pw/generateOtpCode"
import type { OtpPurpose } from "@/auth/model_field/otpPurpose"
import type { MutationCtx } from "@convex/_generated/server"
import { nowIso } from "~utils/date/nowIso"
import { type PromiseResult } from "~utils/result/Result"

export async function otpSaveFn(
  ctx: MutationCtx,
  args: { userId: IdUser; email: string; purpose: OtpPurpose },
): PromiseResult<string> {
  const op = "otpCodeSaveFn"
  const { userId, email, purpose } = args

  // await otpRemovePreviousFn(ctx, { userId, email, purpose })

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
