import type { MutationCtx, QueryCtx } from "@convex/_generated/server"

export async function fileGetByIdFn(ctx: QueryCtx | MutationCtx, fileId: string) {
  return await ctx.db
    .query("files")
    .withIndex("fileId", (q) => q.eq("fileId", fileId))
    .unique()
}
