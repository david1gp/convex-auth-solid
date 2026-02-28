import { type MutationCtx } from "@convex/_generated/server"
import type { IdUser } from "@/auth/convex/IdUser"

export async function userDeleteHardAuthSessions(ctx: MutationCtx, userId: IdUser): Promise<void> {
  const sessions = await ctx.db
    .query("authSessions")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .collect()

  await Promise.all(sessions.map((session) => ctx.db.delete("authSessions", session._id)))
}
