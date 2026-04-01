import { invitationModelToStatus, workspaceInvitationStatusIcon } from "#src/workspace/invitation_ui/orgInvitationStatus.ts"
import type { WorkspaceInvitationStatusProps } from "#src/workspace/invitation_ui/view/WorkspaceInvitationStatusText.tsx"
import { Icon } from "#ui/static/icon/Icon.jsx"
import { classMerge } from "#ui/utils/classMerge.ts"

export function WorkspaceInvitationStatusIcon(p: WorkspaceInvitationStatusProps) {
  return (
    <Icon path={workspaceInvitationStatusIcon[invitationModelToStatus(p.invitation)]} class={classMerge("size-8", p.class)} />
  )
}
