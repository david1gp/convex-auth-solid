import type { IdAuthOtp } from "@/auth/convex/IdUser"
import type { MutationCtx } from "@convex/_generated/server"
import { nowIso } from "~utils/date/nowIso"
import type { PromiseResult } from "~utils/result/Result"

export async function otpConsumeFn(ctx: MutationCtx, args: { otpId: IdAuthOtp }): PromiseResult<void> {
  const op = "otpConsumeFn"
  const { otpId } = args

  await ctx.db.patch("authOtps", otpId, { consumedAt: nowIso() })

  return { success: true, data: undefined }
}
