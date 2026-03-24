import type { OrgInvitationModel } from "#src/org/invitation_model/OrgInvitationModel.js"
import { invitationModelToStatus, orgInvitationStatusText } from "#src/org/invitation_ui/view/orgInvitationStatus.js"
import { DateView } from "#src/ui/date/DateView.jsx"
import { ttt } from "#ui/i18n/ttt.js"
import { classMerge } from "#ui/utils/classMerge.js"
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren.js"
import { Show } from "solid-js"

export interface OrgInvitationStatusProps extends MayHaveClassAndChildren {
  invitation: OrgInvitationModel
}

export function OrgInvitationStatusText(p: OrgInvitationStatusProps) {
  const status = invitationModelToStatus(p.invitation)
  return (
    <div class={classMerge("flex flex-col gap-1", p.class)}>
      <span>{orgInvitationStatusText[status]}</span>
      <Show when={p.invitation.emailSendAt}>
        {(getDate) => <DateView date={getDate()} start={ttt("Email send") + " "} />}
      </Show>
      {p.children}
    </div>
  )
}
