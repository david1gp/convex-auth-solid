import type { MutationCtx } from "#convex/_generated/server.js"
import type { IdUser } from "#src/auth/convex/IdUser.ts"

export async function userDeleteHardFiles(ctx: MutationCtx, userId: IdUser): Promise<void> {
  const files = await ctx.db
    .query("files")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .collect()

  await Promise.all(files.map((file) => ctx.db.delete("files", file._id)))
}
