import { query, type QueryCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { docWorkspaceMemberToModel } from "#src/workspace/member_convex/docWorkspaceMemberToModel.ts"
import type { IdWorkspaceMember } from "#src/workspace/member_convex/IdWorkspaceMember.ts"
import type { WorkspaceMemberModel } from "#src/workspace/member_model/WorkspaceMemberModel.ts"
import { authQueryResult } from "#src/utils/convex_backend/authQueryResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { v } from "convex/values"

export const workspaceMemberGetFields = {
  workspaceHandle: v.string(),
  memberId: v.string(),
  updatedAt: v.optional(v.string()),
} as const

export type WorkspaceMemberGetValidatorType = typeof workspaceMemberGetValidator.type
export const workspaceMemberGetValidator = v.object(workspaceMemberGetFields)

export const workspaceMemberGetQuery = query({
  args: createTokenValidator(workspaceMemberGetFields),
  handler: async (ctx, args) => {
    return await authQueryResult(ctx, args, workspaceMemberGetFn)
  },
})

export async function workspaceMemberGetFn(
  ctx: QueryCtx,
  args: WorkspaceMemberGetValidatorType,
): PromiseResult<WorkspaceMemberModel | null> {
  const op = "workspaceMemberGetFn"

  const workspace = await ctx.db
    .query("workspaces")
    .withIndex("workspaceHandle", (q) => q.eq("workspaceHandle", args.workspaceHandle))
    .unique()
  if (!workspace) {
    return createResultError(op, "Workspace not found", args.workspaceHandle)
  }

  let member = await ctx.db.get("workspaceMembers", args.memberId as IdWorkspaceMember)
  if (!member || member.workspaceId !== workspace._id) {
    return createResultError(op, "Workspace member not found", args.memberId)
  }
  if (args.updatedAt && args.updatedAt === member.updatedAt) {
    return createResult(null)
  }
  return createResult(docWorkspaceMemberToModel(member))
}
