import type { MutationCtx, QueryCtx } from "#convex/_generated/server.js"
import type { DocOrg } from "#src/org/org_convex/IdOrg.js"

export async function orgGetByHandleFn(ctx: QueryCtx | MutationCtx, orgHandle: string): Promise<DocOrg | null> {
  return await ctx.db
    .query("orgs")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", orgHandle))
    .unique()
}
