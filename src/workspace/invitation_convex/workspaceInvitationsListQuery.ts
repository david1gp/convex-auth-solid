import { v } from "convex/values"
import * as a from "valibot"
import { type QueryCtx, query } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { paginationDefaultOptions } from "#src/utils/convex_backend/paginationDefaultOptions.ts"
import { paginationOptsValidator } from "#src/utils/convex_backend/paginationOptsValidator.ts"
import { paginationResultMap } from "#src/utils/convex_backend/paginationResultMap.ts"
import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"
import { docWorkspaceInvitationToModel } from "#src/workspace/invitation_convex/docWorkspaceInvitationToModel.ts"
import type { WorkspaceInvitationModel } from "#src/workspace/invitation_model/WorkspaceInvitationModel.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"

export const workspaceInvitationsListFields = {
  ...valibotToConvex({ workspaceHandle: a.string(), token: a.string() }),
  paginationOpts: paginationOptsValidator,
} as const

export type WorkspaceInvitationsListValidatorType = typeof workspaceInvitationsListValidator.type
export const workspaceInvitationsListValidator = v.object(workspaceInvitationsListFields)

export const workspaceInvitationsListQuery = query({
  args: workspaceInvitationsListValidator,
  handler: workspaceInvitation10ListFn,
})

export async function workspaceInvitation10ListFn(
  ctx: QueryCtx,
  args: WorkspaceInvitationsListValidatorType,
): PromiseResult<PaginationResultType<WorkspaceInvitationModel>> {
  const op = "workspaceInvitationsListFn"

  const workspace = await ctx.db
    .query("workspaces")
    .withIndex("workspaceHandle", (q) => q.eq("workspaceHandle", args.workspaceHandle))
    .unique()
  if (!workspace) {
    return createResultError(op, "Workspace not found", args.workspaceHandle)
  }

  const invitations = await ctx.db
    .query("workspaceInvitations")
    .withIndex("workspaceHandle", (q) => q.eq("workspaceHandle", workspace.workspaceHandle))
    .paginate(args.paginationOpts ?? paginationDefaultOptions)

  return createResult(paginationResultMap(invitations, docWorkspaceInvitationToModel))
}
