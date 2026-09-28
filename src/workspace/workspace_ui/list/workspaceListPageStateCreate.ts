import { createEffect } from "solid-js"
import { api } from "#convex/_generated/api.js"
import { userSessionSignal, userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { cursorPaginationCreate } from "#src/utils/convex_client/cursorPaginationCreate.ts"
import type { WorkspaceModel } from "#src/workspace/workspace_model/WorkspaceModel.ts"
import { workspaceSchema } from "#src/workspace/workspace_model/workspaceSchema.ts"
import { workspaceListSignalAdd } from "#src/workspace/workspace_ui/list/workspaceListSignal.ts"

export function workspaceListPageStateCreate() {
  const pagination = cursorPaginationCreate({
    query: api.workspace.workspacesListQuery,
    queryKey: "workspacesListQuery",
    args: () => ({ token: userTokenGet() }),
    identity: () => userSessionSignal.get()?.profile.userId ?? null,
    itemSchema: workspaceSchema,
  })
  createEffect(() => {
    const result = pagination.page()
    if (!result?.success) return
    for (const workspace of result.data.page as WorkspaceModel[]) workspaceListSignalAdd(workspace)
  })
  return {
    workspaces: () => {
      const result = pagination.page()
      return result?.success ? result.data.page : result ? null : undefined
    },
    page: () => pagination.history().length + 1,
    canPrevious: pagination.canPrevious,
    canNext: pagination.canNext,
    previous: pagination.previous,
    next: pagination.next,
    loading: pagination.loading,
  }
}
