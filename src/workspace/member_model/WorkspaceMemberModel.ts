import type { WorkspaceRole } from "#src/workspace/workspace_model_field/workspaceRole.ts"
import type { HasCreatedAtUpdatedAt } from "#src/utils/data/HasCreatedAtUpdatedAt.ts"

export type WorkspaceMemberDataModel = {
  memberId: string
  workspaceHandle: string
  userId: string
  role: WorkspaceRole
  invitedBy: string
}

export interface WorkspaceMemberModel extends WorkspaceMemberDataModel, HasCreatedAtUpdatedAt {}