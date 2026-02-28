import { type MutationCtx } from "@convex/_generated/server"
import type { IdUser } from "@/auth/convex/IdUser"

export async function userDeleteHardFiles(ctx: MutationCtx, userId: IdUser): Promise<void> {
  const files = await ctx.db
    .query("files")
    .filter((q) => q.eq(q.field("userId"), userId))
    .collect()

  await Promise.all(files.map((file) => ctx.db.delete("files", file._id)))
}
