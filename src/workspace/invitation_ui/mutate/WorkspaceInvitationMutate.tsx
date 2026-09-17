import { createEffect, Match, Switch } from "solid-js"
import { api } from "#convex/_generated/api.js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { queryCreate } from "#src/utils/convex_client/queryCreate.ts"
import { WorkspaceInvitationForm } from "#src/workspace/invitation_ui/form/WorkspaceInvitationForm.tsx"
import { workspaceInvitationFormStateManagement } from "#src/workspace/invitation_ui/form/workspaceInvitationFormStateManagement.ts"
import type { HasWorkspaceHandle } from "#src/workspace/workspace_model_field/HasWorkspaceHandle.ts"
import type { HasWorkspaceInvitationCode } from "#src/workspace/workspace_model_field/HasWorkspaceInvitationCode.ts"
import type { HasFormModeMutate } from "#ui/input/form/formModeMutate.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

interface WorkspaceInvitationMutateProps
  extends HasWorkspaceHandle,
    HasWorkspaceInvitationCode,
    HasFormModeMutate,
    MayHaveClass {}

export function WorkspaceInvitationMutate(p: WorkspaceInvitationMutateProps) {
  const getInvitation = queryCreate(api.workspace.workspaceInvitationGetQuery, {
    invitationCode: p.invitationCode,
  })

  const sm = workspaceInvitationFormStateManagement(p.mode, p.workspaceHandle, p.invitationCode)

  const getInvitationData = () => {
    const result = getInvitation()
    if (!result?.success) {
      return null
    }
    return result.data
  }

  const getInvitationErrorMessage = () => {
    const result = getInvitation()
    if (!result || result.success) {
      return ""
    }
    return result.errorMessage
  }

  createEffect(() => {
    const invitation = getInvitationData()
    if (!invitation) {
      return
    }
    sm.loadData(invitation)
  })

  return (
    <Switch>
      <Match when={!getInvitation()}>
        <WorkspaceInvitationLoading />
      </Match>
      <Match when={getInvitationErrorMessage()}>{(errorMessage) => <ErrorPage title={errorMessage()} />}</Match>
      <Match when={getInvitationData()}>
        <WorkspaceInvitationForm mode={p.mode} sm={sm} />
      </Match>
      <Match when={true}>
        <ErrorPage title={ttc("Invitation not found")} />
      </Match>
    </Switch>
  )
}

function WorkspaceInvitationLoading() {
  return <LoadingSection loadingSubject={ttc("Workspace Invitation")} />
}
