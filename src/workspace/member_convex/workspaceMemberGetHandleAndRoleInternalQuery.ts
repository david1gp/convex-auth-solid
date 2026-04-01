import { internalQuery, type MutationCtx, type QueryCtx } from "#convex/_generated/server.js"
import type { IdUser } from "#src/auth/convex/IdUser.ts"
import { vIdUser } from "#src/auth/convex/vIdUser.ts"
import { workspaceMemberGetByUserIdFn } from "#src/workspace/member_convex/workspaceMemberGetByUserIdFn.ts"
import type { WorkspaceRole } from "#src/workspace/workspace_model_field/workspaceRole.ts"
import { v } from "convex/values"

export type WorkspaceHandleAndRole = {
  workspaceHandle?: string
  workspaceRole?: WorkspaceRole
}

function createEmptyWorkspaceHandleAndRole(): WorkspaceHandleAndRole {
  return { workspaceHandle: undefined, workspaceRole: undefined }
}

export type GetWorkspaceMemberHandleAndRoleValidatorType = typeof getWorkspaceMemberHandleAndRoleValidator.type
export const getWorkspaceMemberHandleAndRoleValidator = v.object({
  userId: vIdUser,
})

export const getWorkspaceMemberHandleAndRoleInternalQuery = internalQuery({
  args: getWorkspaceMemberHandleAndRoleValidator,
  handler: getWorkspaceMemberHandleAndRoleQueryFn,
})

export async function getWorkspaceMemberHandleAndRoleQueryFn(ctx: QueryCtx, args: GetWorkspaceMemberHandleAndRoleValidatorType) {
  return workspaceMemberGetHandleAndRoleFn(ctx, args.userId)
}

export async function workspaceMemberGetHandleAndRoleFn(
  ctx: QueryCtx | MutationCtx,
  userId: IdUser,
): Promise<WorkspaceHandleAndRole> {
  const workspaceMember = await workspaceMemberGetByUserIdFn(ctx, userId)
  if (!workspaceMember) return createEmptyWorkspaceHandleAndRole()
  const workspace = await ctx.db.get("workspaces", workspaceMember.workspaceId)
  if (!workspace) return createEmptyWorkspaceHandleAndRole()
  return { workspaceHandle: workspace.workspaceHandle, workspaceRole: workspaceMember.role }
}
