import { useParams } from "@tanstack/solid-router"
import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"
import { pageDemoHref } from "#src/app/demos/pageDemoHref.ts"
import type { WorkspaceInvitationModel } from "#src/workspace/invitation_model/WorkspaceInvitationModel.ts"
import { workspaceInvitationFormStateManagement } from "#src/workspace/invitation_ui/form/workspaceInvitationFormStateManagement.ts"
import { type WorkspaceRole, workspaceRole } from "#src/workspace/workspace_model_field/workspaceRole.ts"
import { workspaceCoreDemoStateCreate } from "#src/workspace/workspace_ui/workspaceCoreDemoStateCreate.ts"
import { formMode } from "#ui/input/form/formMode.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"

const fixtureKey = "workspace-core:invitations"
const now = "2026-09-28T09:00:00.000Z"
const expiry = "2026-10-28T09:00:00.000Z"

/** Demo-only fixture: no auth, storage, mutation, or email transport is constructed. */
export function workspaceInvitationDemoStateCreate(workspaceHandle?: () => string, invitationCode?: () => string) {
  const store = pageDemoFixtureStoreGet()
  let invitations = store.get<ReturnType<typeof createSignalObject<WorkspaceInvitationModel[]>>>(fixtureKey)
  if (!invitations) {
    invitations = createSignalObject<WorkspaceInvitationModel[]>([
      {
        workspaceHandle: "sample-workspace",
        invitationCode: "invite-1",
        invitedEmail: "guest@example.com",
        role: workspaceRole.member,
        invitedBy: "demo-owner",
        status: "pending",
        expiresAt: expiry,
        createdAt: now,
        updatedAt: now,
      },
    ])
    store.set(fixtureKey, invitations)
  }
  const items = invitations
  let nextCode = store.get<ReturnType<typeof createSignalObject<number>>>(`${fixtureKey}:nextCode`)
  if (!nextCode) {
    nextCode = createSignalObject(2)
    store.set(`${fixtureKey}:nextCode`, nextCode)
  }
  const counter = nextCode
  const params = workspaceHandle || invitationCode ? undefined : useParams({ strict: false })
  const code = () => invitationCode?.() ?? params?.().invitationCode ?? "invite-1"
  const selected = () => items.get().find((invitation) => invitation.invitationCode === code())
  const handle = () =>
    workspaceHandle?.() ?? params?.().workspaceHandle ?? selected()?.workspaceHandle ?? "sample-workspace"
  const workspace = workspaceCoreDemoStateCreate(handle)
  const createdCode = createSignalObject("")
  const notice = createSignalObject("")

  const form = workspaceInvitationFormStateManagement(formMode.add, handle(), undefined, undefined, {
    add: async ({ invitedEmail, role }) => {
      if (
        items
          .get()
          .some(
            (item) =>
              item.workspaceHandle === handle() && item.invitedEmail === invitedEmail && item.status === "pending",
          )
      ) {
        form.errors.invitedEmail.set("This email already has a pending invitation in this demo")
        return
      }
      const newCode = `invite-${counter.get()}`
      counter.set(counter.get() + 1)
      items.set([
        ...items.get(),
        {
          workspaceHandle: handle(),
          invitationCode: newCode,
          invitedEmail,
          role: role as WorkspaceRole,
          invitedBy: "demo-owner",
          status: "pending",
          expiresAt: expiry,
          createdAt: now,
          updatedAt: now,
        },
      ])
      createdCode.set(newCode)
      notice.set("Invitation created locally. No email was sent.")
    },
  })

  return {
    invitations: () => items.get().filter((item) => item.workspaceHandle === handle()),
    invitation: selected,
    workspace: workspace.workspace,
    form,
    createdCode: createdCode.get,
    notice: notice.get,
    handle,
    listHref: () => pageDemoHref("/workspace/:workspaceHandle/invitations", { workspaceHandle: handle() }),
    addHref: () => pageDemoHref("/workspace/:workspaceHandle/invitations/add", { workspaceHandle: handle() }),
    acceptHref: (invitationCode: string) => pageDemoHref("/invite/:invitationCode/accept", { invitationCode }),
    workspaceHref: () => pageDemoHref("/w/:workspaceHandle/view", { workspaceHandle: handle() }),
    resend: (invitationCode: string) => {
      if (!items.get().some((item) => item.invitationCode === invitationCode && item.status === "pending")) return
      notice.set("Demo resend recorded locally. No email was sent.")
    },
    dismiss: (invitationCode: string) => {
      items.set(items.get().filter((item) => item.invitationCode !== invitationCode))
      notice.set("Invitation removed locally.")
    },
    accept: () => {
      if (selected()?.status !== "pending") return
      items.set(items.get().map((item) => (item.invitationCode === code() ? { ...item, status: "accepted" } : item)))
      notice.set("Invitation accepted locally. No account or session was changed.")
    },
  }
}
