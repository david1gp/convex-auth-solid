import { type QueryCtx, internalQuery } from "@convex/_generated/server"
import { v } from "convex/values"
import type { DocUser } from "../IdUser"

export const findUserByEmailInternalQuery = internalQuery({
  args: { email: v.string() },
  handler: async (ctx: QueryCtx, args) => findUserByEmailFn(ctx, args.email),
})

export async function findUserByEmailFn(ctx: QueryCtx, email: string): Promise<DocUser | null> {
  return await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", email))
    .unique()
}
