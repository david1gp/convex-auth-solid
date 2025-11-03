import type { MutationCtx, QueryCtx } from "@convex/_generated/server"


export async function orgGetByHandle(ctx: QueryCtx | MutationCtx, orgHandle: string) {
  return await ctx.db
    .query("orgs")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", orgHandle))
    .unique()
}
