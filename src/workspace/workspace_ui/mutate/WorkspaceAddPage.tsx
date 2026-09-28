import { NavWorkspace } from "#src/app/nav/NavWorkspace.tsx"
import { LinkLikeText } from "#src/ui/links/LinkLikeText.tsx"
import { WorkspaceAdd } from "#src/workspace/workspace_ui/mutate/WorkspaceAdd.tsx"
import { ttt } from "#ui/i18n/ttt.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"

export function WorkspaceAddPage() {
  return (
    <PageWrapper>
      <NavWorkspace getWorkspacePageTitle={getPageTitle}>
        <LinkLikeText>{ttt("Add")}</LinkLikeText>
      </NavWorkspace>
      <WorkspaceAdd />
    </PageWrapper>
  )
}

function getPageTitle(_orgName?: string, _workspaceName?: string) {
  return ttt("Create new Workspace")
}
