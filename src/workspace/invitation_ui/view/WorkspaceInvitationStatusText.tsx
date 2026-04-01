import { workspaceInvitationShowRole } from "#src/workspace/invitation_model/workspaceInvitationShowRole.ts"
import { ttc } from "#src/app/i18n/ttc.ts"
import { workspaceInvitationStatusText } from "#src/workspace/invitation_ui/orgInvitationStatus.ts"
import { invitationModelToStatus, type WorkspaceInvitationStatus } from "#src/workspace/invitation_ui/orgInvitationStatus.ts"
import type { WorkspaceInvitationModel } from "#src/workspace/invitation_model/WorkspaceInvitationModel.ts"
import { DateView } from "#src/ui/date/DateView.tsx"
import { Icon } from "#ui/static/icon/Icon.jsx"
import { classMerge } from "#ui/utils/classMerge.ts"
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren.ts"
import { Show } from "solid-js"

export interface WorkspaceInvitationStatusProps extends MayHaveClassAndChildren {
  invitation: WorkspaceInvitationModel
}

export function WorkspaceInvitationStatusText(p: WorkspaceInvitationStatusProps) {
  const status = invitationModelToStatus(p.invitation)
  return (
    <div class={classMerge("flex flex-col gap-1", p.class)}>
      <span>{workspaceInvitationStatusText[status]}</span>
      <Show when={p.invitation.expiresAt}>
        {(getDate) => <DateView date={getDate()} start={ttc("Expires") + " "} />}
      </Show>
      {p.children}
    </div>
  )
}
