import type { MutationCtx, QueryCtx } from "#convex/_generated/server.js"
import type { IdUser } from "#src/auth/convex/IdUser.ts"
import type { DocWorkspaceMember } from "#src/workspace/member_convex/IdWorkspaceMember.ts"

export async function workspaceMemberGetByUserIdFn(
  ctx: QueryCtx | MutationCtx,
  userId: IdUser,
): Promise<DocWorkspaceMember | null> {
  return await ctx.db
    .query("workspaceMembers")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .first()
}
