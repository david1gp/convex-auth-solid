import { invitationModelToStatus, orgInvitationStatusIcon } from "@/org/invitation_ui/view/orgInvitationStatus"
import type { OrgInvitationStatusProps } from "@/org/invitation_ui/view/OrgInvitationStatusText"
import { Icon0 } from "~ui/static/icon/Icon0"
import { classMerge } from "~ui/utils/classMerge"

export function OrgInvitationStatusIcon(p: OrgInvitationStatusProps) {
  return (
    <Icon0 path={orgInvitationStatusIcon[invitationModelToStatus(p.invitation)]} class={classMerge("size-8", p.class)} />
  )
}
