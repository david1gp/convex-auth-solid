import { NavWorkspace } from "#src/app/nav/NavWorkspace.tsx"
import { LinkLikeText } from "#src/ui/links/LinkLikeText.tsx"
import { WorkspaceForm } from "#src/workspace/workspace_ui/form/WorkspaceForm.tsx"
import { workspaceFormStateManagement } from "#src/workspace/workspace_ui/form/workspaceFormStateManagement.ts"
import { ttt } from "#ui/i18n/ttt.ts"
import { formMode } from "#ui/input/form/formMode.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

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

function getPageTitle(orgName?: string, workspaceName?: string) {
  return ttt("Create new Workspace")
}

export interface WorkspaceAddProps extends MayHaveClass {}

export function WorkspaceAdd(p: WorkspaceAddProps) {
  const sm = workspaceFormStateManagement(formMode.add)
  return <WorkspaceForm mode={formMode.add} sm={sm} class={p.class} />
}
