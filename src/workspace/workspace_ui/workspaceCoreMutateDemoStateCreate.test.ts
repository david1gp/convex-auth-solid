import { afterEach, expect, mock, test } from "bun:test"
import { createRoot } from "solid-js"
import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"

mock.module("@tanstack/solid-router", () => ({ useNavigate: () => () => {}, useParams: () => () => ({}) }))
afterEach(() => pageDemoFixtureStoreGet().clear())

test("workspace edit and remove forms update only the shared demo fixture", async () => {
  const { workspaceCoreDemoStateCreate } = await import("#src/workspace/workspace_ui/workspaceCoreDemoStateCreate.ts")
  const originalFetch = globalThis.fetch
  globalThis.fetch = (() => {
    throw new Error("Demo reached network")
  }) as unknown as typeof fetch
  let dispose = () => {}
  try {
    const state = createRoot((cleanup) => {
      dispose = cleanup
      return workspaceCoreDemoStateCreate(() => "sample-workspace")
    })
    const workspace = state.workspace()!
    const edit = state.editState(workspace)
    edit.state.name.set("Renamed in gallery")
    await edit.handleSubmit({ preventDefault() {} } as SubmitEvent)
    expect(state.workspace()?.name).toBe("Renamed in gallery")
    expect(state.removeHref("sample-workspace")).toBe("/demos/w/sample-workspace/remove")
    const remove = state.removeState(state.workspace()!)
    await remove.handleSubmit({ preventDefault() {} } as SubmitEvent)
    expect(state.workspace()).toBeUndefined()
    expect(workspaceCoreDemoStateCreate(() => "sample-workspace").workspaces()).toEqual([])
  } finally {
    dispose()
    globalThis.fetch = originalFetch
  }
})
