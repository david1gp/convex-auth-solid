import { useParams } from "@tanstack/solid-router"
import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"
import { pageDemoHref } from "#src/app/demos/pageDemoHref.ts"
import type { DocWorkspace, IdWorkspace } from "#src/workspace/workspace_convex/IdWorkspace.ts"
import type { WorkspaceFormData } from "#src/workspace/workspace_ui/form/workspaceFormStateManagement.ts"
import { workspaceFormStateManagement } from "#src/workspace/workspace_ui/form/workspaceFormStateManagement.ts"
import type { WorkspaceListViewState } from "#src/workspace/workspace_ui/list/WorkspaceListViewState.ts"
import { formMode } from "#ui/input/form/formMode.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"

const fixtureKey = "workspace-core:workspaces"

/** Shared, reactive fixtures survive gallery navigation but never touch Convex, auth, or storage. */
export function workspaceCoreDemoStateCreate(workspaceHandle?: () => string | undefined) {
  const store = pageDemoFixtureStoreGet()
  let workspaces = store.get<ReturnType<typeof createSignalObject<DocWorkspace[]>>>(fixtureKey)
  if (!workspaces) {
    workspaces = createSignalObject<DocWorkspace[]>([
      {
        _id: "demo-workspace-1" as IdWorkspace,
        _creationTime: 1,
        workspaceHandle: "sample-workspace",
        name: "Sample Workspace",
        description: "A sample initiative for this gallery.",
        image: "",
        url: "",
        createdAt: "2026-09-28T09:00:00.000Z",
        updatedAt: "2026-09-28T09:00:00.000Z",
      },
    ])
    store.set(fixtureKey, workspaces)
  }
  const items = workspaces
  const params = workspaceHandle ? undefined : useParams({ strict: false })
  const createdHandle = createSignalObject("")

  const addState = () => {
    const sm = workspaceFormStateManagement(formMode.add, undefined, undefined, {
      create: async (data: WorkspaceFormData) => {
        if (items.get().some((item) => item.workspaceHandle === data.workspaceHandle)) {
          sm.errors.workspaceHandle.set("This handle already exists in the demo")
          return
        }
        const now = "2026-09-28T09:00:00.000Z"
        items.set([
          ...items.get(),
          {
            ...data,
            _id: `demo-workspace-${items.get().length + 1}` as IdWorkspace,
            _creationTime: items.get().length + 1,
            createdAt: now,
            updatedAt: now,
          },
        ])
        createdHandle.set(data.workspaceHandle)
      },
    })
    return sm
  }

  return {
    workspaces: items.get,
    listState: {
      workspaces: items.get,
      page: () => 1,
      canPrevious: () => false,
      canNext: () => false,
      previous: () => {},
      next: () => {},
      loading: () => false,
    } satisfies WorkspaceListViewState,
    workspace: () =>
      items
        .get()
        .find(
          (item) => item.workspaceHandle === (workspaceHandle?.() ?? params?.().workspaceHandle ?? "sample-workspace"),
        ),
    addState,
    createdHandle: createdHandle.get,
    listHref: pageDemoHref("/w/list"),
    addHref: pageDemoHref("/w/add"),
    viewHref: (handle: string) => pageDemoHref("/w/:workspaceHandle/view", { workspaceHandle: handle }),
    editHref: (handle: string) => pageDemoHref("/w/:workspaceHandle/edit", { workspaceHandle: handle }),
    removeHref: (handle: string) => pageDemoHref("/w/:workspaceHandle/remove", { workspaceHandle: handle }),
    membersHref: (handle: string) => pageDemoHref("/workspace/:workspaceHandle/members", { workspaceHandle: handle }),
    invitationsHref: (handle: string) =>
      pageDemoHref("/workspace/:workspaceHandle/invitations", { workspaceHandle: handle }),
    editState: (workspace: DocWorkspace) =>
      workspaceFormStateManagement(formMode.edit, workspace.workspaceHandle, workspace, {
        edit: async (data) => {
          items.set(
            items
              .get()
              .map((item) =>
                item._id === workspace._id ? { ...item, ...data, updatedAt: "2026-09-28T09:00:00.000Z" } : item,
              ),
          )
        },
      }),
    removeState: (workspace: DocWorkspace) =>
      workspaceFormStateManagement(formMode.remove, workspace.workspaceHandle, workspace, {
        delete: async () => {
          items.set(items.get().filter((item) => item._id !== workspace._id))
        },
      }),
  }
}
