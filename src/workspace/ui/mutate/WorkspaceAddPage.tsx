import { NavWorkspace } from "@/app/nav/NavWorkspace"
import { LinkLikeText } from "@/ui/links/LinkLikeText"
import type { MayHaveReturnPath } from "@/utils/ui/MayHaveReturnPath"
import { WorkspaceForm } from "@/workspace/ui/form/WorkspaceForm"
import { workspaceFormStateManagement } from "@/workspace/ui/form/workspaceFormStateManagement"
import { ttt } from "~ui/i18n/ttt"
import { formMode } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

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

export interface WorkspaceAddProps extends MayHaveReturnPath, MayHaveClass {}

export function WorkspaceAdd(p: WorkspaceAddProps) {
  const sm = workspaceFormStateManagement(formMode.add)
  return <WorkspaceForm mode={formMode.add} sm={sm} class={p.class} />
}
