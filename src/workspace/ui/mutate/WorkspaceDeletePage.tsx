import { NavWorkspace } from "#src/app/nav/NavWorkspace.js"
import { LinkLikeText } from "#src/ui/links/LinkLikeText.js"
import { ErrorPage } from "#src/ui/pages/ErrorPage.js"
import { WorkspaceMutate } from "#src/workspace/ui/mutate/WorkspaceMutate.js"
import { ttt } from "#ui/i18n/ttt"
import { formMode, getFormModeTitle } from "#ui/input/form/formMode"
import { PageWrapper } from "#ui/static/page/PageWrapper"
import { useParams } from "@solidjs/router.js"
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
