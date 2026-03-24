import { invitationModelToStatus, orgInvitationStatusIcon } from "#src/org/invitation_ui/view/orgInvitationStatus.js"
import type { OrgInvitationStatusProps } from "#src/org/invitation_ui/view/OrgInvitationStatusText.js"
import { Icon } from "#ui/static/icon/Icon"
import { classMerge } from "#ui/utils/classMerge"

export function OrgInvitationStatusIcon(p: OrgInvitationStatusProps) {
  return (
    <Icon path={orgInvitationStatusIcon[invitationModelToStatus(p.invitation)]} class={classMerge("size-8", p.class)} />
  )
}
