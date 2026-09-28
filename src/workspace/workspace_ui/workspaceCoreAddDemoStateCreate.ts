import { workspaceCoreDemoStateCreate } from "#src/workspace/workspace_ui/workspaceCoreDemoStateCreate.ts"

export function workspaceCoreAddDemoStateCreate() {
  const state = workspaceCoreDemoStateCreate()
  return { ...state, form: state.addState() }
}
