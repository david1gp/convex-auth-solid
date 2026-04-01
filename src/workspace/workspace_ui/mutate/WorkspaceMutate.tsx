import type { HasWorkspaceHandle } from "#src/workspace/workspace_model/HasWorkspaceHandle.ts"
import { WorkspaceForm } from "#src/workspace/workspace_ui/form/WorkspaceForm.tsx"
import { workspaceFormStateManagement } from "#src/workspace/workspace_ui/form/workspaceFormStateManagement.ts"
import { WorkspaceLoader, type WorkspaceComponentProps } from "#src/workspace/workspace_ui/view/WorkspaceLoader.tsx"
import type { HasFormModeMutate } from "#ui/input/form/formModeMutate.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

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
