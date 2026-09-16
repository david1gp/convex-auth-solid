import { v } from "convex/values"
import { type QueryCtx, query } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { authQueryResult } from "#src/utils/convex_backend/authQueryResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { paginationDefaultOptions } from "#src/utils/convex_backend/paginationDefaultOptions.ts"
import { paginationOptsValidator } from "#src/utils/convex_backend/paginationOptsValidator.ts"
import { paginationResultMap } from "#src/utils/convex_backend/paginationResultMap.ts"
import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"
import { docWorkspaceMemberToModel } from "#src/workspace/member_convex/docWorkspaceMemberToModel.ts"
import type { WorkspaceMemberModel } from "#src/workspace/member_model/WorkspaceMemberModel.ts"

export type WorkspaceMembersListValidatorType = typeof workspaceMembersListValidator.type

export const workspaceMembersListFields = {
  workspaceHandle: v.string(),
  paginationOpts: paginationOptsValidator,
} as const

export const workspaceMembersListValidator = v.object(workspaceMembersListFields)

export const workspaceMemberListQuery = query({
  args: createTokenValidator(workspaceMembersListFields),
  handler: async (ctx, args) => await authQueryResult(ctx, args, workspaceMemberListFn),
})

export async function workspaceMemberListFn(
  ctx: QueryCtx,
  args: WorkspaceMembersListValidatorType,
): PromiseResult<PaginationResultType<WorkspaceMemberModel>> {
  const op = "workspaceMemberListFn"

  const workspace = await ctx.db
    .query("workspaces")
    .withIndex("workspaceHandle", (q) => q.eq("workspaceHandle", args.workspaceHandle))
    .unique()
  if (!workspace) {
    return createResultError(op, "Workspace not found", args.workspaceHandle)
  }

  const members = await ctx.db
    .query("workspaceMembers")
    .withIndex("workspaceId", (q) => q.eq("workspaceId", workspace._id))
    .paginate(args.paginationOpts ?? paginationDefaultOptions)

  return createResult(paginationResultMap(members, docWorkspaceMemberToModel))
}
