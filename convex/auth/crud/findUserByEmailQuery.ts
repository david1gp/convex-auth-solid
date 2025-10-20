import { internalQuery, type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import type { DocUser } from "../IdUser"

export const findUserByEmailQuery = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args): Promise<DocUser | null> => {
    return findUserByEmailFn(ctx, args.email)
  },
})

export async function findUserByEmailFn(ctx: QueryCtx, email: string): Promise<DocUser | null> {
  return await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", email))
    .unique()
}
