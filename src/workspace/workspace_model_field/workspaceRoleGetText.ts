import { ttc } from "#src/app/i18n/ttc.ts"
import { workspaceRole, type WorkspaceRole } from "#src/workspace/workspace_model_field/workspaceRole.ts"

export function workspaceRoleGetText(r: string) {
  switch (r as WorkspaceRole) {
    case workspaceRole.member:
      return ttc("Member")
    case workspaceRole.guest:
      return ttc("Guest")
  }
}
