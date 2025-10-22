import { type QueryCtx } from "@convex/_generated/server"
import type { DocUser } from "../IdUser"

export async function findUserByEmailFn(ctx: QueryCtx, email: string): Promise<DocUser | null> {
  return await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", email))
    .unique()
}
