import type { IdUser } from "#src/auth/convex/IdUser.js"
import { type MutationCtx } from "@convex/_generated/server.js"

export async function userDeleteHardEmailLoginCodes(ctx: MutationCtx, userId: IdUser): Promise<void> {
  const codes = await ctx.db
    .query("authEmailLoginCodes")
    .filter((q) => q.eq(q.field("userId"), userId))
    .collect()

  await Promise.all(codes.map((code) => ctx.db.delete("authEmailLoginCodes", code._id)))
}
