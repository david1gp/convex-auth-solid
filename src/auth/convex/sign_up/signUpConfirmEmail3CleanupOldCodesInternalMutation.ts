import { week1timeMs } from "@/auth/convex/otp/week1timeMs"
import { type MutationCtx, internalMutation } from "@convex/_generated/server"

export const signUpConfirmEmail3CleanupOldCodesInternalMutation = internalMutation({
  args: {},
  handler: signUpConfirmEmail3CleanupOldCodesInternalMutationFn,
})

export async function signUpConfirmEmail3CleanupOldCodesInternalMutationFn(
  ctx: MutationCtx,
): Promise<{ deleted: number }> {
  const oneDayAgo = new Date(Date.now() - week1timeMs).toISOString()

  const oldCodes = await ctx.db
    .query("authUserEmailRegistrations")
    .filter((q) => q.lt(q.field("createdAt"), oneDayAgo))
    .collect()

  let deletedCount = 0
  for (const code of oldCodes) {
    await ctx.db.delete(code._id)
    deletedCount++
  }

  return { deleted: deletedCount }
}
