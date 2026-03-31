import { invitationModelToStatus, orgInvitationStatusIcon } from "#src/org/invitation_ui/view/orgInvitationStatus.ts"
import type { OrgInvitationStatusProps } from "#src/org/invitation_ui/view/OrgInvitationStatusText.tsx"
import { Icon } from "#ui/static/icon/Icon.jsx"
import { classMerge } from "#ui/utils/classMerge.ts"

export function OrgInvitationStatusIcon(p: OrgInvitationStatusProps) {
  return (
    <Icon path={orgInvitationStatusIcon[invitationModelToStatus(p.invitation)]} class={classMerge("size-8", p.class)} />
  )
}
