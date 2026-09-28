import { WorkspaceForm } from "#src/workspace/workspace_ui/form/WorkspaceForm.tsx"
import {
  type WorkspaceFormStateManagement,
  workspaceFormStateManagement,
} from "#src/workspace/workspace_ui/form/workspaceFormStateManagement.ts"
import { formMode } from "#ui/input/form/formMode.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

export function WorkspaceAdd(p: MayHaveClass & { sm?: WorkspaceFormStateManagement }) {
  const sm = p.sm ?? workspaceFormStateManagement(formMode.add)
  return <WorkspaceForm mode={formMode.add} sm={sm} class={p.class} />
}
