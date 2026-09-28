import type { MutationCtx } from "#convex/_generated/server.js"
import type { IdUser } from "#src/auth/convex/IdUser.ts"

export async function userDeleteHardApiKeys(ctx: MutationCtx, userId: IdUser): Promise<void> {
  while (true) {
    const keys = await ctx.db
      .query("authApiKeys")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .take(500)
    if (keys.length === 0) return
    await Promise.all(keys.map((key) => ctx.db.delete("authApiKeys", key._id)))
  }
}
