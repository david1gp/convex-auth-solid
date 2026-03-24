import { NavWorkspace } from "#src/app/nav/NavWorkspace.jsx"
import { LinkLikeText } from "#src/ui/links/LinkLikeText.jsx"
import { WorkspaceForm } from "#src/workspace/ui/form/WorkspaceForm.jsx"
import { workspaceFormStateManagement } from "#src/workspace/ui/form/workspaceFormStateManagement.js"
import { ttt } from "#ui/i18n/ttt.js"
import { formMode } from "#ui/input/form/formMode.js"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"

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
