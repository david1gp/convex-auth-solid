import { afterEach, expect, mock, test } from "bun:test"
import { createRoot } from "solid-js"
import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"

mock.module("@tanstack/solid-router", () => ({ useNavigate: () => () => {}, useParams: () => () => ({}) }))
afterEach(() => pageDemoFixtureStoreGet().clear())

test("workspace invitation demo adds and accepts locally across route states without network or storage access", async () => {
  const originalFetch = globalThis.fetch
  const originalStorage = globalThis.localStorage
  const originalSession = globalThis.sessionStorage
  globalThis.fetch = (() => {
    throw new Error("Demo reached network")
  }) as unknown as typeof fetch
  globalThis.localStorage = {
    getItem: () => {
      throw new Error("Demo read storage")
    },
    setItem: () => {
      throw new Error("Demo wrote storage")
    },
  } as unknown as Storage
  globalThis.sessionStorage = {
    getItem: () => {
      throw new Error("Demo read session")
    },
  } as unknown as Storage
  let dispose = () => {}
  try {
    const { workspaceInvitationDemoStateCreate } = await import(
      "#src/workspace/invitation_ui/demo/workspaceInvitationDemoStateCreate.ts"
    )
    const state = createRoot((cleanup) => {
      dispose = cleanup
      return workspaceInvitationDemoStateCreate(() => "sample-workspace")
    })
    expect(state.invitations()).toHaveLength(1)
    expect(state.addHref()).toBe("/demos/pages/workspace/sample-workspace/invitations/add")
    state.form.state.invitedEmail.set("new@example.com")
    await state.form.handleSubmit({ preventDefault() {} } as SubmitEvent)
    expect(state.invitations()).toHaveLength(2)
    expect(state.notice()).toContain("No email was sent")
    const code = state.createdCode()
    expect(state.acceptHref(code)).toBe(`/demos/pages/invite/${code}/accept`)

    const acceptState = workspaceInvitationDemoStateCreate(undefined, () => code)
    expect(acceptState.invitation()?.invitedEmail).toBe("new@example.com")
    expect(acceptState.workspace()?.name).toBe("Sample Workspace")
    acceptState.accept()
    expect(state.invitations().find((item) => item.invitationCode === code)?.status).toBe("accepted")
    expect(acceptState.workspaceHref()).toBe("/demos/pages/w/sample-workspace/view")
    state.resend("invite-1")
    expect(state.notice()).toContain("No email was sent")
    state.dismiss("invite-1")
    expect(state.invitations().map((item) => item.invitationCode)).toEqual([code])
    await state.form.handleSubmit({ preventDefault() {} } as SubmitEvent)
    expect(state.invitations()).toHaveLength(2)
    expect(state.createdCode()).not.toBe(code)
  } finally {
    dispose()
    globalThis.fetch = originalFetch
    globalThis.localStorage = originalStorage
    globalThis.sessionStorage = originalSession
  }
})

test("workspace invitation demo rejects duplicate pending email and isolates fixtures by workspace", async () => {
  const { workspaceInvitationDemoStateCreate } = await import(
    "#src/workspace/invitation_ui/demo/workspaceInvitationDemoStateCreate.ts"
  )
  const state = workspaceInvitationDemoStateCreate(() => "sample-workspace")
  state.form.state.invitedEmail.set("guest@example.com")
  await state.form.handleSubmit({ preventDefault() {} } as SubmitEvent)
  expect(state.form.errors.invitedEmail.get()).toContain("already has a pending invitation")
  expect(state.invitations()).toHaveLength(1)
  expect(workspaceInvitationDemoStateCreate(() => "another-workspace").invitations()).toEqual([])
})

test("workspace renderer opts in exactly the three invitation pages through the existing map", async () => {
  const renderer = await Bun.file(new URL("../../workspace_ui/WorkspaceCorePageDemos.tsx", import.meta.url)).text()
  const invitationMap = await Bun.file(new URL("./WorkspaceInvitationPageDemos.tsx", import.meta.url)).text()
  expect(renderer).toContain("...WorkspaceInvitationPageDemos")
  for (const route of [
    "/workspace/:workspaceHandle/invitations",
    "/workspace/:workspaceHandle/invitations/add",
    "/invite/:invitationCode/accept",
  ]) {
    expect(invitationMap).toContain(`"${route}":`)
  }
  expect(invitationMap).not.toContain("WorkspaceInvitationAcceptPage")
  expect(invitationMap).not.toContain("WorkspaceInvitationListPage")
})
