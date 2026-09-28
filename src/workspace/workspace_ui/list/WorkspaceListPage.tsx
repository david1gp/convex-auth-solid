import { NavWorkspace } from "#src/app/nav/NavWorkspace.tsx"
import { LinkLikeText } from "#src/ui/links/LinkLikeText.tsx"
import { WorkspaceListView } from "#src/workspace/workspace_ui/list/WorkspaceListView.tsx"
import { workspaceListPageStateCreate } from "#src/workspace/workspace_ui/list/workspaceListPageStateCreate.ts"
import { urlWorkspaceAdd, urlWorkspaceView } from "#src/workspace/workspace_url/urlWorkspace.ts"
import { ttt } from "#ui/i18n/ttt.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"

export function WorkspaceListPage() {
  const state = workspaceListPageStateCreate()
  return (
    <PageWrapper>
      <NavWorkspace getWorkspacePageTitle={() => ttt("Workspaces")}>
        <LinkLikeText>{ttt("List")}</LinkLikeText>
      </NavWorkspace>
      <WorkspaceListView state={state} addHref={urlWorkspaceAdd()} viewHref={urlWorkspaceView} />
    </PageWrapper>
  )
}
