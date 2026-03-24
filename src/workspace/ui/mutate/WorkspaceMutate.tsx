import type { HasWorkspaceHandle } from "#src/workspace/model/HasWorkspaceHandle.js"
import { WorkspaceForm } from "#src/workspace/ui/form/WorkspaceForm.js"
import { workspaceFormStateManagement } from "#src/workspace/ui/form/workspaceFormStateManagement.js"
import { WorkspaceLoader, type WorkspaceComponentProps } from "#src/workspace/ui/view/WorkspaceLoader.js"
import type { HasFormModeMutate } from "#ui/input/form/formModeMutate"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"

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
