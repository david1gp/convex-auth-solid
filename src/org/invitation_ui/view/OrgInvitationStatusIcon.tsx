import { invitationModelToStatus, orgInvitationStatusIcon } from "#src/org/invitation_ui/view/orgInvitationStatus.js"
import type { OrgInvitationStatusProps } from "#src/org/invitation_ui/view/OrgInvitationStatusText.jsx"
import { Icon } from "#ui/static/icon/Icon.jsx"
import { classMerge } from "#ui/utils/classMerge.js"

export function OrgInvitationStatusIcon(p: OrgInvitationStatusProps) {
  return (
    <Icon path={orgInvitationStatusIcon[invitationModelToStatus(p.invitation)]} class={classMerge("size-8", p.class)} />
  )
}
