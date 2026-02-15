import type { MutationCtx } from "@convex/_generated/server"
import type { IdUser } from "@/auth/convex/IdUser"

export async function userDeleteHardOtps(ctx: MutationCtx, userId: IdUser): Promise<void> {
  const codes = await ctx.db
    .query("authOtps")
    .filter((q) => q.eq(q.field("userId"), userId))
    .collect()

  await Promise.all(codes.map((code) => ctx.db.delete("authOtps", code._id)))
}
