import { api } from "#convex/_generated/api.js"
import type { Result } from "#result"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.js"
import type { ResourceDataModel } from "#src/resource/model/ResourceModel.js"
import { resourceFormLocalStorage } from "#src/resource/ui/form/resourceFormLocalStorage.js"
import { type ResourceFormData } from "#src/resource/ui/form/resourceFormStateManagement.js"
import { resourceNameSet } from "#src/resource/ui/resourceNameRecordSignal.js"
import { urlResourceList, urlResourceView } from "#src/resource/url/urlResource.js"
import { createMutation } from "#src/utils/convex_client/createMutation.js"
import { navigateTo } from "#src/utils/router/navigateTo.js"
import type { HasToken } from "#src/utils/ui/HasToken.js"
import { type FormMode, formMode } from "#ui/input/form/formMode.js"
import { toastAdd } from "#ui/interactive/toast/toastAdd.js"
import { toastVariant } from "#ui/interactive/toast/toastVariant.js"

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
