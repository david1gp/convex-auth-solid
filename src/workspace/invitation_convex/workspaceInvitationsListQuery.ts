import { query, type QueryCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { docWorkspaceInvitationToModel } from "#src/workspace/invitation_convex/docWorkspaceInvitationToModel.ts"
import type { WorkspaceInvitationModel } from "#src/workspace/invitation_model/WorkspaceInvitationModel.ts"
import { v } from "convex/values"

export const workspaceInvitationsListFields = {
  workspaceHandle: v.string(),
  token: v.string(),
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
): PromiseResult<WorkspaceInvitationModel[]> {
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
    .filter((q) => q.eq(q.field("workspaceHandle"), workspace.workspaceHandle))
    .collect()

  return createResult(invitations.map(docWorkspaceInvitationToModel))
}
