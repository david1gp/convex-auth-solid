import { useParams } from "@tanstack/solid-router"
import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"
import { pageDemoHref } from "#src/app/demos/pageDemoHref.ts"
import type { WorkspaceMemberModel } from "#src/workspace/member_model/WorkspaceMemberModel.ts"
import { workspaceMemberFormStateManagement } from "#src/workspace/member_ui/form/workspaceMemberFormStateManagement.ts"
import { workspaceRole } from "#src/workspace/workspace_model_field/workspaceRole.ts"
import { formMode } from "#ui/input/form/formMode.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"

const fixtureKey = "workspace-core:members"

export function workspaceMemberDemoStateCreate(workspaceHandle?: () => string, memberId?: () => string) {
  const store = pageDemoFixtureStoreGet()
  let members = store.get<ReturnType<typeof createSignalObject<WorkspaceMemberModel[]>>>(fixtureKey)
  if (!members) {
    members = createSignalObject<WorkspaceMemberModel[]>([
      {
        memberId: "member-1",
        workspaceHandle: "sample-workspace",
        userId: "sample-user",
        role: workspaceRole.member,
        invitedBy: "demo-owner",
        createdAt: "2026-09-28T09:00:00.000Z",
        updatedAt: "2026-09-28T09:00:00.000Z",
      },
    ])
    store.set(fixtureKey, members)
  }
  const items = members
  const params = workspaceHandle ? undefined : useParams({ strict: false })
  const handle = () => workspaceHandle?.() ?? params?.().workspaceHandle ?? "sample-workspace"
  const selectedId = () => memberId?.() ?? params?.().memberId ?? "member-1"
  const createdId = createSignalObject("")
  const form = workspaceMemberFormStateManagement(formMode.add, handle(), undefined, undefined, {
    add: async ({ userId, role }) => {
      if (!userId.trim()) {
        form.errors.userId.set("Enter a demo user ID")
        return
      }
      if (items.get().some((member) => member.workspaceHandle === handle() && member.userId === userId)) {
        form.errors.userId.set("This user is already a member in this demo")
        return
      }
      form.errors.userId.set("")
      let nextId = items.get().length + 1
      while (items.get().some((member) => member.memberId === `demo-member-${nextId}`)) nextId++
      const id = `demo-member-${nextId}`
      items.set([
        ...items.get(),
        {
          memberId: id,
          workspaceHandle: handle(),
          userId,
          role,
          invitedBy: "demo-owner",
          createdAt: "2026-09-28T09:00:00.000Z",
          updatedAt: "2026-09-28T09:00:00.000Z",
        },
      ])
      createdId.set(id)
    },
  })
  form.state.userId.set("demo-user-2")
  return {
    members: () => items.get().filter((member) => member.workspaceHandle === handle()),
    handle,
    member: () => items.get().find((member) => member.workspaceHandle === handle() && member.memberId === selectedId()),
    form,
    createdId: createdId.get,
    listHref: () => pageDemoHref("/workspace/:workspaceHandle/members", { workspaceHandle: handle() }),
    addHref: () => pageDemoHref("/workspace/:workspaceHandle/members/add", { workspaceHandle: handle() }),
    editHref: (id: string) =>
      pageDemoHref("/workspace/:workspaceHandle/members/:memberId/edit", { workspaceHandle: handle(), memberId: id }),
    deleteHref: (id: string) =>
      pageDemoHref("/workspace/:workspaceHandle/members/:memberId/delete", { workspaceHandle: handle(), memberId: id }),
    editMember: (id: string, role: WorkspaceMemberModel["role"]) => {
      if (!items.get().some((member) => member.workspaceHandle === handle() && member.memberId === id)) return
      items.set(
        items
          .get()
          .map((member) =>
            member.workspaceHandle === handle() && member.memberId === id
              ? { ...member, role, updatedAt: "2026-09-28T10:00:00.000Z" }
              : member,
          ),
      )
    },
    removeMember: (id: string) => {
      items.set(items.get().filter((member) => member.workspaceHandle !== handle() || member.memberId !== id))
    },
  }
}
