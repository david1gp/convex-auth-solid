import type { HasWorkspaceHandle } from "@/workspace/model/HasWorkspaceHandle"
import { WorkspaceForm } from "@/workspace/ui/form/WorkspaceForm"
import { workspaceFormStateManagement } from "@/workspace/ui/form/workspaceFormStateManagement"
import { WorkspaceLoader, type WorkspaceComponentProps } from "@/workspace/ui/view/WorkspaceLoader"
import type { HasFormModeMutate } from "~ui/input/form/formModeMutate"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

interface WorkspaceMutateProps extends HasWorkspaceHandle, HasFormModeMutate, MayHaveClass {}

export function WorkspaceMutate(p: WorkspaceMutateProps) {
  function WorkspaceComponent(wp: WorkspaceComponentProps) {
    return <WorkspaceMutateForm mode={p.mode} {...wp} />
  }
  return <WorkspaceLoader workspaceHandle={p.workspaceHandle} WorkspaceComponent={WorkspaceComponent} />
}

interface WorkspaceMutateFormProps extends WorkspaceComponentProps, HasFormModeMutate, MayHaveClass {}

function WorkspaceMutateForm(p: WorkspaceMutateFormProps) {
  const sm = workspaceFormStateManagement(p.mode, p.workspace.workspaceHandle, p.workspace)
  return <WorkspaceForm workspaceHandle={p.workspace.workspaceHandle} mode={p.mode} sm={sm} />
}
