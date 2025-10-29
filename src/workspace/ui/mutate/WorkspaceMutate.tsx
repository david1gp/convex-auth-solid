import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createMutation } from "@/utils/convex/createMutation"
import { createQuery } from "@/utils/convex/createQuery"
import type { MayHaveReturnPath } from "@/utils/ui/MayHaveReturnPath"
import type { DocWorkspace } from "@/workspace/convex/IdWorkspace"
import type { HasWorkspaceHandle } from "@/workspace/model/HasWorkspaceHandle"
import {
  workspaceCreateFormStateManagement,
  type WorkspaceFormActions,
  type WorkspaceFormData,
} from "@/workspace/ui/form/workspaceCreateFormStateManagement"
import { WorkspaceForm } from "@/workspace/ui/form/WorkspaceForm"
import { urlWorkspaceList, urlWorkspaceView } from "@/workspace/url/urlWorkspace"
import { api } from "@convex/_generated/api"
import { useNavigate } from "@solidjs/router"
import { Show, createEffect } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode, type HasFormModeMutate } from "~ui/input/form/formMode"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

interface WorkspaceMutateProps extends HasWorkspaceHandle, HasFormModeMutate, MayHaveReturnPath, MayHaveClass {}

export function WorkspaceMutate(p: WorkspaceMutateProps) {
  const op = "WorkspaceMutate"
  const navigator = useNavigate()
  const getWorkspace = createQuery(api.workspace.workspaceGetQuery, {
    token: userTokenGet(),
    workspaceHandle: p.workspaceHandle,
  }) as () => DocWorkspace | undefined

  const editMutation = createMutation(api.workspace.workspaceEditMutation)
  const deleteMutation = createMutation(api.workspace.workspaceDeleteMutation)

  async function editAction(data: Partial<WorkspaceFormData>) {
    const editResult = await editMutation({
      // auth
      token: userTokenGet(),
      // data
      ...data,
      // id
      workspaceHandle: p.workspaceHandle,
    })
    if (!editResult.success) {
      console.error(editResult)
      toastAdd({ title: editResult.errorMessage, variant: toastVariant.error })
      return
    }
    const url = (p.returnPath ?? p.mode === formMode.edit) ? urlWorkspaceView(p.workspaceHandle) : urlWorkspaceList()
    navigator(url)
  }
  async function removeAction() {
    const deleteResult = await deleteMutation({
      // auth
      token: userTokenGet(),
      // id
      workspaceHandle: p.workspaceHandle,
    })
    if (!deleteResult.success) {
      console.error(deleteResult)
      toastAdd({ title: deleteResult.errorMessage, variant: toastVariant.error })
      return
    }
    const url = (p.returnPath ?? p.mode === formMode.edit) ? urlWorkspaceView(p.workspaceHandle) : urlWorkspaceList()
    navigator(url)
  }

  const actions: WorkspaceFormActions = {}
  if (p.mode === formMode.edit) {
    actions.edit = editAction
  }
  if (p.mode === formMode.remove) {
    actions.delete = removeAction
  }

  const sm = workspaceCreateFormStateManagement(actions)

  createEffect(() => {
    const ws = getWorkspace()
    if (!ws) {
      return
    }
    sm.loadData(ws)
  })

  return (
    <Show when={getWorkspace()} fallback={<WorkspaceLoading />}>
      <WorkspaceForm mode={p.mode} sm={sm} />
    </Show>
  )
}

function WorkspaceLoading() {
  return <LoadingSection loadingSubject={ttt("Workspace")} />
}
