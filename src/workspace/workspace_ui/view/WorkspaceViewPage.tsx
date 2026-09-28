import { Match, Switch } from "solid-js"
import { NavWorkspace } from "#src/app/nav/NavWorkspace.tsx"
import { LinkLikeText } from "#src/ui/links/LinkLikeText.tsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { WorkspaceLoader } from "#src/workspace/workspace_ui/view/WorkspaceLoader.tsx"
import { WorkspaceView } from "#src/workspace/workspace_ui/view/WorkspaceView.tsx"
import { workspaceViewPageStateCreate } from "#src/workspace/workspace_ui/view/workspaceViewPageStateCreate.ts"
import { ttt } from "#ui/i18n/ttt.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"

export function WorkspaceViewPage() {
  const state = workspaceViewPageStateCreate()
  return (
    <Switch>
      <Match when={!state.workspaceHandle()}>
        <ErrorPage title={ttt("Missing :workspaceHandle in path")} />
      </Match>
      <Match when={state.workspaceHandle()}>
        <PageWrapper>
          <NavWorkspace getWorkspacePageTitle={getPageTitle} workspaceHandle={state.workspaceHandle()}>
            <LinkLikeText>{ttt("View")}</LinkLikeText>
          </NavWorkspace>
          <WorkspaceLoader workspaceHandle={state.workspaceHandle()!} WorkspaceComponent={WorkspaceView} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(_orgName?: string, workspaceName?: string) {
  let title = "Workspace"
  if (workspaceName) title += ` ${workspaceName}`
  return title
}
