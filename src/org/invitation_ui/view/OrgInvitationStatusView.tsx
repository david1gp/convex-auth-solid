import {
  orgInvitationStatusIcon,
  orgInvitationStatusText,
  type OrgInvitationStatusAndTime,
} from "@/org/invitation_ui/view/orgInvitationStatus"
import { Icon1 } from "~ui/static/icon/Icon1"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface OrgInvitationStatusProps extends OrgInvitationStatusAndTime, MayHaveClass {}

export function OrgInvitationStatusView(p: OrgInvitationStatusProps) {
  return (
    <div class={classMerge("flex flex-wrap gap-2", p.class)}>
      <Icon1 path={orgInvitationStatusIcon[p.status]} />
      <span>{orgInvitationStatusText[p.status]}</span>
    </div>
  )
}
