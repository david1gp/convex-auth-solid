import { NavWorkspace } from "#src/app/nav/NavWorkspace.js"
import { LinkLikeText } from "#src/ui/links/LinkLikeText.js"
import { WorkspaceForm } from "#src/workspace/ui/form/WorkspaceForm.js"
import { workspaceFormStateManagement } from "#src/workspace/ui/form/workspaceFormStateManagement.js"
import { ttt } from "#ui/i18n/ttt"
import { formMode } from "#ui/input/form/formMode"
import { PageWrapper } from "#ui/static/page/PageWrapper"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"

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
