import { workspaceCoreDemoStateCreate } from "#src/workspace/workspace_ui/workspaceCoreDemoStateCreate.ts"

export function workspaceCoreMutateDemoStateCreate() {
  const state = workspaceCoreDemoStateCreate()
  const workspace = state.workspace()
  return {
    ...state,
    selectedWorkspace: workspace,
    editForm: workspace && state.editState(workspace),
    removeForm: workspace && state.removeState(workspace),
  }
}
