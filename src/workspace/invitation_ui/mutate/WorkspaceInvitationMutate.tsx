import { api } from "#convex/_generated/api.js"
import { ttc } from "#src/app/i18n/ttc.ts"
import type { DocWorkspaceInvitation } from "#src/workspace/invitation_convex/IdWorkspaceInvitation.ts"
import { WorkspaceInvitationForm } from "#src/workspace/invitation_ui/form/WorkspaceInvitationForm.tsx"
import { workspaceInvitationFormStateManagement } from "#src/workspace/invitation_ui/form/workspaceInvitationFormStateManagement.ts"
import type { HasWorkspaceHandle } from "#src/workspace/workspace_model_field/HasWorkspaceHandle.ts"
import type { HasWorkspaceInvitationCode } from "#src/workspace/workspace_model_field/HasWorkspaceInvitationCode.ts"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { createQuery } from "#src/utils/convex_client/createQuery.ts"
import type { HasFormModeMutate } from "#ui/input/form/formModeMutate.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { Show, createEffect } from "solid-js"

interface WorkspaceInvitationMutateProps extends HasWorkspaceHandle, HasWorkspaceInvitationCode, HasFormModeMutate, MayHaveClass {}

export function WorkspaceInvitationMutate(p: WorkspaceInvitationMutateProps) {
  const getInvitation = createQuery(api.workspace.workspaceInvitationGetQuery, {
    invitationCode: p.invitationCode,
  }) as () => DocWorkspaceInvitation | undefined

  const sm = workspaceInvitationFormStateManagement(p.mode, p.workspaceHandle, p.invitationCode)

  createEffect(() => {
    const invitation = getInvitation()
    if (!invitation) {
      return
    }
    sm.loadData(invitation)
  })

  return (
    <Show when={getInvitation()} fallback={<WorkspaceInvitationLoading />}>
      <WorkspaceInvitationForm mode={p.mode} sm={sm} />
    </Show>
  )
}

function WorkspaceInvitationLoading() {
  return <LoadingSection loadingSubject={ttc("Workspace Invitation")} />
}
