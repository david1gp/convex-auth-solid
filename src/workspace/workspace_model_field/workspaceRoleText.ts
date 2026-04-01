import type { WorkspaceRole } from "#src/workspace/workspace_model_field/workspaceRole.ts"
import { ttt } from "#ui/i18n/ttt.ts"

export const workspaceRoleText = {
  member: ttt("Member"),
  guest: ttt("Guest"),
} as const satisfies Record<WorkspaceRole, string>
