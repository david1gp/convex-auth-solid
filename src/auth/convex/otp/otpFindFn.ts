import type { DocAuthOtp } from "@/auth/convex/IdUser"
import type { OtpPurpose } from "@/auth/model_field/otpPurpose"
import type { MutationCtx, QueryCtx } from "@convex/_generated/server"
import { type PromiseResult, createError } from "~utils/result/Result"

export async function otpFindFn(
  ctx: QueryCtx | MutationCtx,
  args: { email: string; code: string; purpose: OtpPurpose },
): PromiseResult<DocAuthOtp> {
  const op = "otpFindFn"
  const { email, code, purpose } = args

  const otpRecord = await ctx.db
    .query("authOtps")
    .withIndex("emailCode", (q) => q.eq("email", email).eq("code", code))
    .filter((q) => q.eq(q.field("purpose"), purpose))
    .filter((q) => q.eq(q.field("consumedAt"), undefined))
    .first()

  if (!otpRecord) {
    return createError(op, "Invalid or expired code")
  }

  return { success: true, data: otpRecord }
}
