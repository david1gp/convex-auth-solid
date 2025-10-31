import type { QueryCtx } from "@convex/_generated/server"
import type { DocUser, IdUser } from "../IdUser"

export async function userGetQueryFn(ctx: QueryCtx, userId: IdUser): Promise<DocUser | null> {
  return await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("_id"), userId))
    .unique()
}
