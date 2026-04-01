import { ttc } from "#src/app/i18n/ttc.ts"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavWorkspace } from "#src/app/nav/NavWorkspace.tsx"
import { WorkspaceMemberForm } from "#src/workspace/member_ui/form/WorkspaceMemberForm.tsx"
import { workspaceMemberFormStateManagement } from "#src/workspace/member_ui/form/workspaceMemberFormStateManagement.ts"
import { urlWorkspaceMemberAdd } from "#src/workspace/member_url/urlWorkspaceMember.ts"
import type { HasWorkspaceHandle } from "#src/workspace/workspace_model_field/HasWorkspaceHandle.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { formMode } from "#ui/input/form/formMode.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"

export function WorkspaceMemberAddPage() {
  const params = useParams()
  const getWorkspaceHandle = () => params.workspaceHandle
  return (
    <Switch>
      <Match when={!getWorkspaceHandle()}>
        <ErrorPage title={ttc("Missing :memberId in path")} />
      </Match>
      <Match when={getWorkspaceHandle()}>
        <PageWrapper>
          <NavWorkspace getWorkspacePageTitle={getPageTitle} workspaceHandle={getWorkspaceHandle()}>
            <NavLinkButton href={urlWorkspaceMemberAdd(getWorkspaceHandle()!)} isActive={true}>
              {ttc("Add Member")}
            </NavLinkButton>
          </NavWorkspace>
          <WorkspaceMemberAdd workspaceHandle={getWorkspaceHandle()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(workspaceName?: string) {
  return ttc("Add new Workspace Member")
}

export interface WorkspaceMemberAddProps extends HasWorkspaceHandle, MayHaveClass {}

export function WorkspaceMemberAdd(p: WorkspaceMemberAddProps) {
  const sm = workspaceMemberFormStateManagement(formMode.add, p.workspaceHandle)
  return <WorkspaceMemberForm mode={formMode.add} sm={sm} class={p.class} />
}
