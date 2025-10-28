import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { createMutation } from "@/utils/convex/createMutation"
import { createQuery } from "@/utils/convex/createQuery"
import type { MayHaveReturnPath } from "@/utils/ui/MayHaveReturnPath"
import type { DocWorkspace } from "@/workspace/convex/IdWorkspace"
import type { HasWorkspaceSlug } from "@/workspace/model/HasWorkspaceSlug"
import { workspaceCreateFormStateManagement, type WorkspaceFormData } from "@/workspace/ui/form/workspaceCreateFormStateManagement"
import { WorkspaceForm } from "@/workspace/ui/form/WorkspaceForm"
import { urlWorkspaceList, urlWorkspaceView } from "@/workspace/url/urlWorkspace"
import { api } from "@convex/_generated/api"
import { useNavigate } from "@solidjs/router"
import { Show, createEffect } from "solid-js"
import { formMode, type HasFormModeMutate } from "~ui/input/form/formMode"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

interface WorkspaceMutateProps extends HasWorkspaceSlug, HasFormModeMutate, MayHaveReturnPath, MayHaveClass {}

export function WorkspaceMutate(p: WorkspaceMutateProps) {
  const op = "WorkspaceMutate"
  const navigator = useNavigate()
  const getWorkspace = createQuery(api.workspace.workspaceGetQuery, {
    token: userTokenGet(),
    workspaceSlug: p.workspaceSlug,
  }) as () => DocWorkspace | undefined

  const editAction = createMutation(api.workspace.workspaceEditMutation)
  const deleteAction = createMutation(api.workspace.workspaceDeleteMutation)
  async function action(data: WorkspaceFormData): Promise<void> {
    const workspaceIdResult =
      p.mode === formMode.edit
        ? await editAction({
            // auth
            token: userTokenGet(),
            // id
            workspaceSlug: p.workspaceSlug,
            // data
            ...data,
          })
        : await deleteAction({
            // auth
            token: userTokenGet(),
            // id
            workspaceSlug: p.workspaceSlug,
          })
    if (!workspaceIdResult.success) {
      console.error(workspaceIdResult)
      toastAdd({ title: workspaceIdResult.errorMessage, variant: toastVariant.error })
      return
    }
    const url = (p.returnPath ?? p.mode === formMode.edit) ? urlWorkspaceView(p.workspaceSlug) : urlWorkspaceList()
    navigator(url)
  }

  const sm = workspaceCreateFormStateManagement(action)

  createEffect(() => {
    const ws = getWorkspace()
    if (!ws) {
      return
    }
    sm.loadData(ws)
  })

  return (
    <Show when={getWorkspace()} fallback={<LoadingWorkspace />}>
      <WorkspaceForm mode={p.mode} sm={sm} />
    </Show>
  )
}

function LoadingWorkspace() {
  return <div class="opacity-80">Loading workspace...</div>
}
