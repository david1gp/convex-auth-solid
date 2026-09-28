import { afterAll, afterEach, beforeAll, expect, mock, test } from "bun:test"
import { createRoot } from "solid-js"
import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"

mock.module("@tanstack/solid-router", () => ({
  useNavigate: () => () => {},
  useParams: () => () => ({}),
}))

const originalStorage = globalThis.localStorage
const originalSessionStorage = globalThis.sessionStorage
const originalFetch = globalThis.fetch
beforeAll(() => {
  globalThis.localStorage = {
    getItem: () => {
      throw new Error("demo read storage")
    },
    setItem: () => {
      throw new Error("demo wrote to storage")
    },
  } as unknown as Storage
  globalThis.sessionStorage = {
    getItem: () => {
      throw new Error("demo read session")
    },
    setItem: () => {
      throw new Error("demo wrote to session")
    },
  } as unknown as Storage
  globalThis.fetch = (() => {
    throw new Error("demo requested network")
  }) as unknown as typeof fetch
})
afterAll(() => {
  globalThis.localStorage = originalStorage
  globalThis.sessionStorage = originalSessionStorage
  globalThis.fetch = originalFetch
})

afterEach(() => pageDemoFixtureStoreGet().clear())

test("creating a workspace updates the shared demo list and view without invoking production actions", async () => {
  const { workspaceCoreDemoStateCreate } = await import("#src/workspace/workspace_ui/workspaceCoreDemoStateCreate.ts")
  let dispose = () => {}
  const state = createRoot((cleanup) => {
    dispose = cleanup
    return workspaceCoreDemoStateCreate(() => "new-workspace")
  })
  const form = state.addState()
  form.state.name.set("New Workspace")
  form.state.workspaceHandle.set("new-workspace")
  form.state.description.set("Local sample")
  await form.handleSubmit({ preventDefault() {} } as SubmitEvent)
  expect(state.workspaces().map((item) => item.workspaceHandle)).toEqual(["sample-workspace", "new-workspace"])
  expect(state.workspace()?.description).toBe("Local sample")
  expect(workspaceCoreDemoStateCreate(() => "new-workspace").workspace()?.name).toBe("New Workspace")
  expect(state.createdHandle()).toBe("new-workspace")
  expect(state.listHref).toBe("/demos/pages/w/list")
  expect(state.addHref).toBe("/demos/pages/w/add")
  expect(state.viewHref("new-workspace")).toBe("/demos/pages/w/new-workspace/view")
  expect(state.editHref("new-workspace")).toBe("/demos/pages/w/new-workspace/edit")
  dispose()
})

test("duplicate handles are rejected in the fixture with visible form feedback", async () => {
  const { workspaceCoreDemoStateCreate } = await import("#src/workspace/workspace_ui/workspaceCoreDemoStateCreate.ts")
  let dispose = () => {}
  const state = createRoot((cleanup) => {
    dispose = cleanup
    return workspaceCoreDemoStateCreate(() => "sample-workspace")
  })
  const form = state.addState()
  form.state.name.set("Duplicate")
  form.state.workspaceHandle.set("sample-workspace")
  await form.handleSubmit({ preventDefault() {} } as SubmitEvent)
  expect(state.workspaces()).toHaveLength(1)
  expect(form.errors.workspaceHandle.get()).toContain("already exists")
  dispose()
})
