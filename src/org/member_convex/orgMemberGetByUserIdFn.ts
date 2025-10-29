import type { IdUser } from "@/auth/convex/IdUser"
import type { MutationCtx, QueryCtx } from "@convex/_generated/server"
import type { DocOrgMember } from "./IdOrgMember"

export async function orgMemberGetByUserIdFn(
  ctx: QueryCtx | MutationCtx,
  userId: IdUser,
): Promise<DocOrgMember | null> {
  return await ctx.db
    .query("orgMembers")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .first()
}
