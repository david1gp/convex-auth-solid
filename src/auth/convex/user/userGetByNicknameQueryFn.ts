import type { QueryCtx } from "@convex/_generated/server"
import type { DocUser } from "../IdUser"

export async function userGetByNicknameQueryFn(ctx: QueryCtx, username: string): Promise<DocUser | null> {
  return await ctx.db
    .query("users")
    .withIndex("username", (q) => q.eq("username", username))
    .unique()
}
