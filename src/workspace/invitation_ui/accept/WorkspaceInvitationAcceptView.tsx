import { ttc } from "#src/app/i18n/ttc.ts"
import type { WorkspaceInvitationModel } from "#src/workspace/invitation_model/WorkspaceInvitationModel.ts"
import type { WorkspaceModel } from "#src/workspace/workspace_model/WorkspaceModel.ts"
import { workspaceRoleGetText } from "#src/workspace/workspace_model_field/workspaceRoleGetText.ts"
import { WorkspaceViewInformation } from "#src/workspace/workspace_ui/view/WorkspaceViewInformation.tsx"
import { Button } from "#ui/interactive/button/Button.jsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { classesCardWrapperP8 } from "#ui/static/card/classesCardWrapper.ts"
import { classArr } from "#ui/utils/classArr.ts"

interface WorkspaceInvitationAcceptViewProps {
  invitation: WorkspaceInvitationModel
  workspace: WorkspaceModel
  onAccept: () => void
  accepted?: boolean
}

export function WorkspaceInvitationAcceptView(p: WorkspaceInvitationAcceptViewProps) {
  return (
    <div class="space-y-6">
      <WorkspaceViewInformation showEditButton={false} workspace={p.workspace} />
      <section class={classArr(classesCardWrapperP8, "max-w-md mx-auto", "mt-10 mb-15")}>
        <h2 class="text-xl font-semibold mb-4">{ttc("Accept Invitation")}</h2>
        <p class="text-muted-foreground mb-4">
          {ttc("You have been invited to join workspace as")} {workspaceRoleGetText(p.invitation.role)}.
        </p>
        <Button variant={buttonVariant.filledIndigo} onClick={p.onAccept} disabled={p.accepted}>
          {p.accepted ? ttc("Invitation accepted") : ttc("Accept Invitation")}
        </Button>
      </section>
    </div>
  )
}
