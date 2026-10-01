import type { MutationCtx } from "#convex/_generated/server.js"
import type { IdUser } from "#src/auth/convex/IdUser.ts"
import type { OtpPurpose } from "#src/auth/model_field/otpPurpose.ts"

export async function otpRemovePreviousFn(
  ctx: MutationCtx,
  args: { userId: IdUser; email: string; purpose: OtpPurpose },
): Promise<void> {
  const { userId, email, purpose } = args

  const existingCodes = await ctx.db
    .query("authOtps")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .filter((q) =>
      q.and(q.eq(q.field("email"), email), q.eq(q.field("purpose"), purpose), q.eq(q.field("consumedAt"), undefined)),
    )
    .collect()

  for (const code of existingCodes) {
    await ctx.db.delete("authOtps", code._id)
  }
}
