import { internalMutation, type MutationCtx } from "@convex/_generated/server"

export const signUpConfirmEmail3CleanupOldCodesInternalMutation = internalMutation({
  args: {},
  handler: async (ctx: MutationCtx): Promise<{ deleted: number }> => {
    return signUpCleanupOldCodesFn(ctx)
  },
})

export async function signUpCleanupOldCodesFn(ctx: MutationCtx): Promise<{ deleted: number }> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

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
