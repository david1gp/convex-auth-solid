import { invitationModelToStatus, orgInvitationStatusIcon } from "@/org/invitation_ui/view/orgInvitationStatus"
import type { OrgInvitationStatusProps } from "@/org/invitation_ui/view/OrgInvitationStatusText"
import { Icon } from "~ui/static/icon/Icon"
import { classMerge } from "~ui/utils/classMerge"

export function OrgInvitationStatusIcon(p: OrgInvitationStatusProps) {
  return (
    <Icon path={orgInvitationStatusIcon[invitationModelToStatus(p.invitation)]} class={classMerge("size-8", p.class)} />
  )
}
