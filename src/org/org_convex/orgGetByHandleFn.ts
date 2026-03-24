import type { DocOrg } from "#src/org/org_convex/IdOrg.js"
import type { MutationCtx, QueryCtx } from "@convex/_generated/server.js"

export async function orgGetByHandleFn(ctx: QueryCtx | MutationCtx, orgHandle: string): Promise<DocOrg | null> {
  return await ctx.db
    .query("orgs")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", orgHandle))
    .unique()
}
