import type { IdAuthOtp } from "@/auth/convex/IdUser"
import type { MutationCtx } from "@convex/_generated/server"
import type { PromiseResult } from "~result"
import { nowIso } from "~utils/date/nowIso"

export async function otpConsumeFn(ctx: MutationCtx, args: { otpId: IdAuthOtp }): PromiseResult<void> {
  const op = "otpCodeConsumeFn"
  const { otpId } = args

  await ctx.db.patch("authOtps", otpId, { consumedAt: nowIso() })

  return { success: true, data: undefined }
}
