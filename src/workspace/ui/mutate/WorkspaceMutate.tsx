import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { createMutation } from "@/utils/convex/createMutation"
import type { MayHaveReturnPath } from "@/utils/ui/MayHaveReturnPath"
import type { HasWorkspaceHandle } from "@/workspace/model/HasWorkspaceHandle"
import {
  workspaceCreateFormState,
  type WorkspaceFormActions,
  type WorkspaceFormData,
} from "@/workspace/ui/form/workspaceCreateFormState"
import { WorkspaceForm } from "@/workspace/ui/form/WorkspaceForm"
import { WorkspaceLoader, type WorkspaceComponentProps } from "@/workspace/ui/view/WorkspaceLoader"
import { urlWorkspaceList, urlWorkspaceView } from "@/workspace/url/urlWorkspace"
import { api } from "@convex/_generated/api"
import { useNavigate } from "@solidjs/router"
import { createEffect } from "solid-js"
import { formMode, type HasFormModeMutate } from "~ui/input/form/formMode"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

interface WorkspaceMutateProps extends HasWorkspaceHandle, HasFormModeMutate, MayHaveClass {}

export function WorkspaceMutate(p: WorkspaceMutateProps) {
  function WorkspaceComponent(wp: WorkspaceComponentProps) {
    return <WorkspaceMutateForm mode={p.mode} {...wp} />
  }
  return <WorkspaceLoader workspaceHandle={p.workspaceHandle} WorkspaceComponent={WorkspaceComponent} />
}

interface WorkspaceMutateFormProps
  extends WorkspaceComponentProps,
    HasFormModeMutate,
    MayHaveReturnPath,
    MayHaveClass {}

function WorkspaceMutateForm(p: WorkspaceMutateFormProps) {
  const op = "WorkspaceMutateForm"
  const navigator = useNavigate()
  const editMutation = createMutation(api.workspace.workspaceEditMutation)
  const deleteMutation = createMutation(api.workspace.workspaceDeleteMutation)

  async function editAction(data: Partial<WorkspaceFormData>) {
    const editResult = await editMutation({
      // auth
      token: userTokenGet(),
      // data
      ...data,
      // id
      workspaceHandle: p.workspace.workspaceHandle,
    })
    if (!editResult.success) {
      console.error(editResult)
      toastAdd({ title: editResult.errorMessage, variant: toastVariant.error })
      return
    }
    navigator(getReturnPath())
  }
  async function removeAction() {
    const deleteResult = await deleteMutation({
      // auth
      token: userTokenGet(),
      // id
      workspaceHandle: p.workspace.workspaceHandle,
    })
    if (!deleteResult.success) {
      console.error(deleteResult)
      toastAdd({ title: deleteResult.errorMessage, variant: toastVariant.error })
      return
    }
    navigator(getReturnPath())
  }
  function getReturnPath() {
    if (p.mode === formMode.edit) return urlWorkspaceView(p.workspace.workspaceHandle)
    return urlWorkspaceList()
  }

  const actions: WorkspaceFormActions = {}
  if (p.mode === formMode.edit) {
    actions.edit = editAction
  }
  if (p.mode === formMode.remove) {
    actions.delete = removeAction
  }

  const sm = workspaceCreateFormState(p.mode, actions)

  createEffect(() => {
    const ws = p.workspace
    if (!ws) {
      return
    }
    sm.loadData(ws)
  })
  return <WorkspaceForm workspaceHandle={p.workspace.workspaceHandle} mode={p.mode} sm={sm} />
}
