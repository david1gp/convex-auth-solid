import { type QueryCtx, query } from "#convex/_generated/server.js"
import type { DocUser } from "#src/auth/convex/IdUser.js"
import { v } from "convex/values"

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
