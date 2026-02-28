import { type MutationCtx } from "@convex/_generated/server"
import type { IdUser } from "@/auth/convex/IdUser"

export async function userDeleteHardAuthAccounts(ctx: MutationCtx, userId: IdUser): Promise<void> {
  const accounts = await ctx.db
    .query("authAccounts")
    .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
    .collect()

  await Promise.all(accounts.map((account) => ctx.db.delete("authAccounts", account._id)))
}
