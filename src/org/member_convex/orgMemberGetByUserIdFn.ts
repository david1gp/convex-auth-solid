import type { IdUser } from "#src/auth/convex/IdUser.js"
import type { DocOrgMember } from "#src/org/member_convex/IdOrgMember.js"
import type { MutationCtx, QueryCtx } from "@convex/_generated/server.js"

export async function orgMemberGetByUserIdFn(
  ctx: QueryCtx | MutationCtx,
  userId: IdUser,
): Promise<DocOrgMember | null> {
  return await ctx.db
    .query("orgMembers")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .first()
}
