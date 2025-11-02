import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import { invitationDocToStatus, orgInvitationStatusText } from "@/org/invitation_ui/view/orgInvitationStatus"
import { DateView } from "@/ui/date/DateView"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClassAndChildren } from "~ui/utils/MayHaveClassAndChildren"

export interface OrgInvitationStatusProps extends MayHaveClassAndChildren {
  invitation: DocOrgInvitation
}

export function OrgInvitationStatusText(p: OrgInvitationStatusProps) {
  const status = invitationDocToStatus(p.invitation)
  return (
    <div class={classMerge("flex flex-col gap-1", p.class)}>
      <span>{orgInvitationStatusText[status]}</span>
      <Show when={p.invitation.acceptedAt ?? p.invitation.emailSendAt}>
        {(getDate) => (
          <DateView
            date={getDate()}
            start={p.invitation.emailSendAt && !p.invitation.acceptedAt ? ttt("Email send") + " " : ""}
          />
        )}
      </Show>
      {p.children}
    </div>
  )
}
