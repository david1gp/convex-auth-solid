import { ttc } from "#src/app/i18n/ttc.ts"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavWorkspace } from "#src/app/nav/NavWorkspace.tsx"
import { WorkspaceMemberMutate } from "#src/workspace/member_ui/mutate/WorkspaceMemberMutate.tsx"
import { urlWorkspaceMemberEdit } from "#src/workspace/member_url/urlWorkspaceMember.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { formMode, getFormModeTitle } from "#ui/input/form/formMode.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"

const mode = formMode.edit

export function WorkspaceMemberEditPage() {
  const params = useParams()
  const getWorkspaceHandle = () => params.workspaceHandle
  const getMemberId = () => params.memberId
  return (
    <Switch>
      <Match when={!getWorkspaceHandle()}>
        <ErrorPage title={ttc("Missing :workspaceHandle in path")} />
      </Match>
      <Match when={!getMemberId()}>
        <ErrorPage title={ttc("Missing :memberId in path")} />
      </Match>
      <Match when={getMemberId()}>
        <PageWrapper>
          <NavWorkspace getWorkspacePageTitle={getPageTitle} workspaceHandle={getWorkspaceHandle()}>
            <NavLinkButton href={urlWorkspaceMemberEdit(getWorkspaceHandle()!, getMemberId()!)} isActive={true}>
              {ttc("Edit Member")}
            </NavLinkButton>
          </NavWorkspace>
          <WorkspaceMemberMutate mode={mode} workspaceHandle={getWorkspaceHandle()!} memberId={getMemberId()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(workspaceName?: string, workspaceNameAlt?: string) {
  return getFormModeTitle(mode, ttc("Workspace Member"))
}
