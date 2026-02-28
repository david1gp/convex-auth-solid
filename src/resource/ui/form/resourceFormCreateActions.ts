import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { ResourceDataModel } from "@/resource/model/ResourceModel"
import { resourceFormLocalStorage } from "@/resource/ui/form/resourceFormLocalStorage"
import { type ResourceFormData } from "@/resource/ui/form/resourceFormStateManagement"
import { resourceNameSet } from "@/resource/ui/resourceNameRecordSignal"
import { urlResourceList, urlResourceView } from "@/resource/url/urlResource"
import { createMutation } from "@/utils/convex_client/createMutation"
import { navigateTo } from "@/utils/router/navigateTo"
import type { HasToken } from "@/utils/ui/HasToken"
import { api } from "@convex/_generated/api"
import { type FormMode, formMode } from "~ui/input/form/formMode"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import type { Result } from "~utils/result/Result"

export type ResourceFormActions = {
  create?: ResourceFormCreateFn
  edit?: ResourceFormEditFn
  delete?: ResourceFormDeleteFn
}

export type ResourceFormCreateFn = (state: ResourceFormData) => Promise<void>

export type ResourceFormEditFn = (state: Partial<ResourceFormData>) => Promise<void>

export type ResourceFormDeleteFn = () => Promise<void>

export function resourceFormCreateActions(mode: FormMode, resourceId: string | undefined): ResourceFormActions {
  const actions: ResourceFormActions = {}
  if (mode === formMode.add) {
    const addMutation = createMutation(api.resource.resourceCreateMutation)
    actions.create = async (data) => createAction(data, addMutation)
  }
  if (mode === formMode.edit) {
    const editMutation = createMutation(api.resource.resourceEditMutation)
    actions.edit = async (data) => editAction(data, resourceId, mode, editMutation)
  }
  if (mode === formMode.remove) {
    const deleteMutation = createMutation(api.resource.resourceDeleteMutation)
    actions.delete = async () => removeAction(resourceId, mode, deleteMutation)
  }
  return actions
}
interface ResourceCreateMutationProps extends ResourceDataModel, HasToken {}

interface ResourceEditMutationProps extends Partial<ResourceDataModel>, HasToken {
  resourceId: string
}

interface ResourceRemoveMutationProps extends HasToken {
  resourceId: string
}

async function createAction(
  data: ResourceFormData,
  addMutation: (data: ResourceCreateMutationProps) => Promise<Result<string>>,
): Promise<void> {
  const resourceIdResult = await addMutation({
    token: userTokenGet(),
    ...data,
  })
  if (!resourceIdResult.success) {
    console.error(resourceIdResult)
    toastAdd({ title: resourceIdResult.errorMessage, variant: toastVariant.error })
    return
  }
  resourceFormLocalStorage.clearLocalStorage()
  resourceNameSet(data.resourceId, data.name)
  const url = urlResourceView(data.resourceId)
  navigateTo(url)
}

async function editAction(
  data: Partial<ResourceFormData>,
  resourceId: string | undefined,
  mode: FormMode,
  editMutation: (data: ResourceEditMutationProps) => Promise<Result<null>>,
) {
  if (!resourceId) {
    toastAdd({ title: "!resourceId", variant: toastVariant.error })
    return
  }
  const editResult = await editMutation({
    token: userTokenGet(),
    ...data,
    resourceId,
  })
  if (!editResult.success) {
    console.error(editResult)
    toastAdd({ title: editResult.errorMessage, variant: toastVariant.error })
    return
  }
  navigateTo(getReturnPath(mode, resourceId))
}

async function removeAction(
  resourceId: string | undefined,
  mode: FormMode,
  deleteMutation: (data: ResourceRemoveMutationProps) => Promise<Result<null>>,
) {
  if (!resourceId) {
    toastAdd({ title: "!resourceId", variant: toastVariant.error })
    return
  }
  const deleteResult = await deleteMutation({
    token: userTokenGet(),
    resourceId,
  })
  if (!deleteResult.success) {
    console.error(deleteResult)
    toastAdd({ title: deleteResult.errorMessage, variant: toastVariant.error })
    return
  }
  navigateTo(getReturnPath(mode, resourceId))
}

function getReturnPath(mode: FormMode, resourceId?: string) {
  if (mode === formMode.edit && resourceId) {
    return urlResourceView(resourceId)
  }
  return urlResourceList()
}
