import { type QueryCtx, query } from "@convex/_generated/server"
import { v } from "convex/values"
import type { DocUser } from "../IdUser"

export const userGetByUsernameQuery = query({
  args: { username: v.string() },
  handler: async (ctx: QueryCtx, args) => userGetByNicknameQueryFn(ctx, args.username),
})

export async function userGetByNicknameQueryFn(ctx: QueryCtx, username: string): Promise<DocUser | null> {
  return await ctx.db
    .query("users")
    .withIndex("username", (q) => q.eq("username", username))
    .unique()
}
