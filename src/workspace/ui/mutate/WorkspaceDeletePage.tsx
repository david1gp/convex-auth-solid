import { NavWorkspace } from "#src/app/nav/NavWorkspace.jsx"
import { LinkLikeText } from "#src/ui/links/LinkLikeText.jsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.jsx"
import { WorkspaceMutate } from "#src/workspace/ui/mutate/WorkspaceMutate.jsx"
import { ttt } from "#ui/i18n/ttt.js"
import { formMode, getFormModeTitle } from "#ui/input/form/formMode.js"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"

const mode = formMode.remove

export function WorkspaceDeletePage() {
  const params = useParams()
  const getWorkspaceHandle = () => params.workspaceHandle
  return (
    <Switch>
      <Match when={!getWorkspaceHandle()}>
        <ErrorPage title={ttt("Missing :workspaceHandle in path")} />
      </Match>
      <Match when={getWorkspaceHandle()}>
        <PageWrapper>
          <NavWorkspace getWorkspacePageTitle={getPageTitle} workspaceHandle={getWorkspaceHandle()}>
            <LinkLikeText>{ttt("Remove")}</LinkLikeText>
          </NavWorkspace>
          <WorkspaceMutate mode={mode} workspaceHandle={getWorkspaceHandle()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return getFormModeTitle(mode, workspaceName ?? ttt("Workspace"))
}
