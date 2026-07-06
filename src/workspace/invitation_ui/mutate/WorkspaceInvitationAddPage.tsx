import { useParams } from "@tanstack/solid-router"
import { Match, Switch } from "solid-js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { LayoutWrapperApp } from "#src/app/layout/LayoutWrapperApp.tsx"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavWorkspace } from "#src/app/nav/NavWorkspace.tsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { WorkspaceInvitationForm } from "#src/workspace/invitation_ui/form/WorkspaceInvitationForm.tsx"
import { workspaceInvitationFormStateManagement } from "#src/workspace/invitation_ui/form/workspaceInvitationFormStateManagement.ts"
import { urlWorkspaceInvitationAdd } from "#src/workspace/invitation_url/urlWorkspaceInvitation.ts"
import type { HasWorkspaceHandle } from "#src/workspace/workspace_model_field/HasWorkspaceHandle.ts"
import { formMode } from "#ui/input/form/formMode.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

export function WorkspaceInvitationAddPage() {
  const params = useParams({ strict: false })
  const getWorkspaceHandle = () => params().workspaceHandle
  return (
    <Switch>
      <Match when={!getWorkspaceHandle()}>
        <ErrorPage title={ttc("Missing :workspaceHandle in path")} />
      </Match>
      <Match when={getWorkspaceHandle()}>{(getHandle) => <AddPage workspaceHandle={getHandle()} />}</Match>
    </Switch>
  )
}

interface AddPageProps extends HasWorkspaceHandle, MayHaveClass {}

function AddPage(p: AddPageProps) {
  return (
    <LayoutWrapperApp>
      <PageWrapper>
        <NavWorkspace getWorkspacePageTitle={inviteToText} workspaceHandle={p.workspaceHandle}>
          <NavLinkButton href={urlWorkspaceInvitationAdd(p.workspaceHandle)} isActive={true}>
            {ttc("Invite Member")}
          </NavLinkButton>
        </NavWorkspace>
        <WorkspaceInvitationAdd workspaceHandle={p.workspaceHandle} />
      </PageWrapper>
    </LayoutWrapperApp>
  )
}

function inviteToText(workspaceName?: string) {
  const subject = workspaceName ?? ttc("Workspace")
  return ttc("Invite to") + " " + subject
}

export interface WorkspaceInvitationAddProps extends HasWorkspaceHandle, MayHaveClass {}

export function WorkspaceInvitationAdd(p: WorkspaceInvitationAddProps) {
  const sm = workspaceInvitationFormStateManagement(formMode.add, p.workspaceHandle)
  return (
    <WorkspaceInvitationForm
      title={inviteToText(getWorkspaceName(p.workspaceHandle))}
      mode={formMode.add}
      sm={sm}
      class={p.class}
    />
  )
}

function getWorkspaceName(workspaceHandle: string) {
  return workspaceHandle
}
