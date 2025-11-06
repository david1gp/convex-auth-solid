import { type QueryCtx, internalQuery } from "@convex/_generated/server"
import type { DocUser, IdUser } from "../IdUser"
import { vIdUser } from "../vIdUser"

export const userGetInternalQuery = internalQuery({
  args: { userId: vIdUser },
  handler: async (ctx: QueryCtx, args) => userGetQueryFn(ctx, args.userId),
})

export async function userGetQueryFn(ctx: QueryCtx, userId: IdUser): Promise<DocUser | null> {
  return await ctx.db.get(userId)
}
