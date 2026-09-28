import { afterEach, expect, mock, test } from "bun:test"
import { createRoot } from "solid-js"
import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"
import { workspaceRole } from "#src/workspace/workspace_model_field/workspaceRole.ts"

mock.module("@tanstack/solid-router", () => ({ useNavigate: () => () => {}, useParams: () => () => ({}) }))
afterEach(() => pageDemoFixtureStoreGet().clear())

test("adding, editing, and removing a workspace member update only the local fixture and demo links", async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (() => {
    throw new Error("Demo reached network")
  }) as unknown as typeof fetch
  const previousSessionStorage = globalThis.sessionStorage
  const previousLocalStorage = globalThis.localStorage
  globalThis.sessionStorage = {
    getItem: () => {
      throw new Error("Demo read session")
    },
  } as unknown as Storage
  globalThis.localStorage = {
    getItem: () => {
      throw new Error("Demo read storage")
    },
  } as unknown as Storage
  let dispose = () => {}
  try {
    const { workspaceMemberDemoStateCreate } = await import(
      "#src/workspace/member_ui/demo/workspaceMemberDemoStateCreate.ts"
    )
    const { workspaceMemberDemoMutateStateCreate } = await import(
      "#src/workspace/member_ui/demo/workspaceMemberDemoMutateStateCreate.ts"
    )
    const state = createRoot((cleanup) => {
      dispose = cleanup
      const add = workspaceMemberDemoStateCreate(() => "sample-workspace")
      return {
        add,
        edit: () => workspaceMemberDemoMutateStateCreate("edit", () => "sample-workspace", add.createdId),
        remove: () => workspaceMemberDemoMutateStateCreate("remove", () => "sample-workspace", add.createdId),
      }
    })
    state.add.form.state.userId.set("new-user")
    state.add.form.state.role.set(workspaceRole.guest)
    await state.add.form.handleSubmit({ preventDefault() {} } as SubmitEvent)
    expect(state.add.members().map((member) => member.userId)).toEqual(["sample-user", "new-user"])
    expect(state.add.members()[1]?.role).toBe(workspaceRole.guest)
    expect(state.add.editHref(state.add.createdId())).toBe(
      "/demos/pages/workspace/sample-workspace/members/demo-member-2/edit",
    )
    expect(workspaceMemberDemoStateCreate(() => "sample-workspace").members()).toHaveLength(2)
    await state.add.form.handleSubmit({ preventDefault() {} } as SubmitEvent)
    expect(state.add.members()).toHaveLength(2)
    expect(state.add.form.errors.userId.get()).toContain("already a member")

    const edit = state.edit()
    expect(edit.form.state.role.get()).toBe(workspaceRole.guest)
    expect(edit.member()?.userId).toBe("new-user")
    expect(edit.deleteHref()).toBe("/demos/pages/workspace/sample-workspace/members/demo-member-2/delete")
    edit.form.state.role.set(workspaceRole.member)
    await edit.form.handleSubmit({ preventDefault() {} } as SubmitEvent)
    expect(edit.saved()).toBe(true)
    expect(state.add.members()[1]?.role).toBe(workspaceRole.member)
    expect(state.add.members()[1]?.updatedAt).toBe("2026-09-28T10:00:00.000Z")

    const remove = state.remove()
    expect(remove.form.state.role.get()).toBe(workspaceRole.member)
    await remove.form.handleSubmit({ preventDefault() {} } as SubmitEvent)
    expect(remove.saved()).toBe(true)
    expect(remove.member()).toBeUndefined()
    expect(state.add.members().map((member) => member.userId)).toEqual(["sample-user"])
    expect(remove.listHref()).toBe("/demos/pages/workspace/sample-workspace/members")
  } finally {
    dispose()
    globalThis.fetch = originalFetch
    globalThis.sessionStorage = previousSessionStorage
    globalThis.localStorage = previousLocalStorage
  }
})

test("member edit and delete cannot change a member outside the selected workspace", async () => {
  const { workspaceMemberDemoStateCreate } = await import(
    "#src/workspace/member_ui/demo/workspaceMemberDemoStateCreate.ts"
  )
  const { workspaceMemberDemoMutateStateCreate } = await import(
    "#src/workspace/member_ui/demo/workspaceMemberDemoMutateStateCreate.ts"
  )
  let dispose = () => {}
  try {
    const state = createRoot((cleanup) => {
      dispose = cleanup
      return {
        original: workspaceMemberDemoStateCreate(() => "sample-workspace"),
        edit: workspaceMemberDemoMutateStateCreate(
          "edit",
          () => "other-workspace",
          () => "member-1",
        ),
        remove: workspaceMemberDemoMutateStateCreate(
          "remove",
          () => "other-workspace",
          () => "member-1",
        ),
      }
    })
    expect(state.edit.member()).toBeUndefined()
    state.edit.form.state.role.set(workspaceRole.guest)
    await state.edit.form.handleSubmit({ preventDefault() {} } as SubmitEvent)
    await state.remove.form.handleSubmit({ preventDefault() {} } as SubmitEvent)
    expect(state.edit.saved()).toBe(false)
    expect(state.remove.saved()).toBe(false)
    expect(state.original.members().map((member) => [member.memberId, member.role])).toEqual([
      ["member-1", workspaceRole.member],
    ])
  } finally {
    dispose()
  }
})

test("adding after deleting a fixture member gives the new member a distinct demo ID", async () => {
  const { workspaceMemberDemoStateCreate } = await import(
    "#src/workspace/member_ui/demo/workspaceMemberDemoStateCreate.ts"
  )
  const { workspaceMemberDemoMutateStateCreate } = await import(
    "#src/workspace/member_ui/demo/workspaceMemberDemoMutateStateCreate.ts"
  )
  let dispose = () => {}
  try {
    const state = createRoot((cleanup) => {
      dispose = cleanup
      return {
        add: workspaceMemberDemoStateCreate(() => "sample-workspace"),
        remove: workspaceMemberDemoMutateStateCreate(
          "remove",
          () => "sample-workspace",
          () => "member-1",
        ),
      }
    })
    state.add.form.state.userId.set("second-user")
    await state.add.form.handleSubmit({ preventDefault() {} } as SubmitEvent)
    await state.remove.form.handleSubmit({ preventDefault() {} } as SubmitEvent)
    state.add.form.state.userId.set("third-user")
    await state.add.form.handleSubmit({ preventDefault() {} } as SubmitEvent)
    expect(state.add.members().map((member) => member.memberId)).toEqual(["demo-member-2", "demo-member-3"])
  } finally {
    dispose()
  }
})
