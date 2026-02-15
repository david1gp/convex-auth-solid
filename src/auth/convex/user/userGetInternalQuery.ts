import { type QueryCtx, internalQuery } from "@convex/_generated/server"
import type { DocUser, IdUser } from "@/auth/convex/IdUser"
import { vIdUser } from "@/auth/convex/vIdUser"

export const userGetInternalQuery = internalQuery({
  args: { userId: vIdUser },
  handler: async (ctx: QueryCtx, args) => userGetQueryFn(ctx, args.userId),
})

export async function userGetQueryFn(ctx: QueryCtx, userId: IdUser): Promise<DocUser | null> {
  return await ctx.db.get("users", userId)
}
