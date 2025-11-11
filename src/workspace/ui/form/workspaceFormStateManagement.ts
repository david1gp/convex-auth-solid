import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { createMutation } from "@/utils/convex/createMutation"
import { debounceMs } from "@/utils/ui/debounceMs"
import type { HasToken } from "@/utils/ui/HasToken"
import { handleGenerate } from "@/utils/valibot/handleSchema"
import type { DocWorkspace, IdWorkspace } from "@/workspace/convex/IdWorkspace"
import type { HasWorkspaceHandle } from "@/workspace/model/HasWorkspaceHandle"
import type { WorkspaceDataModel } from "@/workspace/model/WorkspaceModel"
import { workspaceDataSchemaFields } from "@/workspace/model/workspaceSchema"
import { urlWorkspaceList, urlWorkspaceView } from "@/workspace/url/urlWorkspace"
import { api } from "@convex/_generated/api"
import { mdiAlertCircle, mdiPenOff } from "@mdi/js"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import { useNavigate } from "@solidjs/router"
import * as a from "valibot"
import { ttt } from "~ui/i18n/ttt"
import { formMode, type FormMode } from "~ui/input/form/formMode"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"
import type { NavigateTo } from "~ui/utils/NavigateTo"
import type { Result } from "~utils/result/Result"

export type WorkspaceFormField = keyof typeof workspaceFormField

export const workspaceFormField = {
  // id
  workspaceHandle: "workspaceHandle",
  // data
  name: "name",
  description: "description",
  image: "image",
  url: "url",
} as const

export type WorkspaceFormData = {
  workspaceHandle: string
  // data
  name: string
  description: string
  image: string
  url: string
}

export type WorkspaceFormState = {
  name: SignalObject<string>
  workspaceHandle: SignalObject<string>
  description: SignalObject<string>
  image: SignalObject<string>
  url: SignalObject<string>
}

export type WorkspaceFormErrorState = {
  name: SignalObject<string>
  workspaceHandle: SignalObject<string>
  description: SignalObject<string>
  image: SignalObject<string>
  url: SignalObject<string>
}

function workspaceCreateState(): WorkspaceFormState {
  return {
    name: createSignalObject(""),
    workspaceHandle: createSignalObject(""),
    description: createSignalObject(""),
    image: createSignalObject(""),
    url: createSignalObject(""),
  }
}

export type WorkspaceFormStateManagement = {
  mode: FormMode
  isSaving: SignalObject<boolean>
  serverState: SignalObject<DocWorkspace>
  state: WorkspaceFormState
  errors: WorkspaceFormErrorState
  hasErrors: () => boolean
  fillTestData: () => void
  loadData: (data: DocWorkspace) => void
  validateOnChange: (field: WorkspaceFormField) => Scheduled<[value: string]>
  handleSubmit: (e: SubmitEvent) => Promise<void>
}

function createWorkspaceFormData(): WorkspaceFormData {
  return { name: "", workspaceHandle: "", description: "", image: "", url: "" }
}

function createEmptyDocWorkspace(): DocWorkspace {
  const now = new Date()
  const iso = now.toISOString()
  return {
    ...createWorkspaceFormData(),
    _id: "" as IdWorkspace,
    createdAt: iso,
    updatedAt: iso,
    _creationTime: now.getMilliseconds(),
  }
}

export function workspaceFormStateManagement(
  mode: FormMode,
  workspaceHandle?: string,
  workspace?: DocWorkspace,
): WorkspaceFormStateManagement {
  const navigator = useNavigate()
  const actions: WorkspaceFormActions = createActions(mode, workspaceHandle, navigator)
  const serverState = createSignalObject(createEmptyDocWorkspace())
  const isSaving = createSignalObject(false)
  const state = workspaceCreateState()
  if (workspace) {
    loadData(workspace, serverState, state)
  }
  const errors = workspaceCreateState()
  return {
    mode,
    isSaving,
    serverState,
    state,
    loadData: (data: DocWorkspace) => loadData(data, serverState, state),
    errors,
    hasErrors: () => hasErrors(errors),
    fillTestData: () => fillTestData(state, errors),
    validateOnChange: (field: WorkspaceFormField) => validateOnChange(field, state, serverState, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, isSaving, serverState, state, errors, actions),
  }
}

function loadData(data: DocWorkspace, serverState: SignalObject<DocWorkspace>, state: WorkspaceFormState): void {
  serverState.set(data)
  state.name.set(data.name)
  state.workspaceHandle.set(data.workspaceHandle)
  state.description.set(data.description ?? "")
  state.image.set(data.image ?? "")
  state.url.set(data.url ?? "")
}

function hasErrors(errors: WorkspaceFormErrorState) {
  return (
    !!errors.name.get() ||
    !!errors.workspaceHandle.get() ||
    !!errors.description.get() ||
    !!errors.image.get() ||
    !!errors.url.get()
  )
}
function fillTestData(state: WorkspaceFormState, errors: WorkspaceFormErrorState) {
  state.name.set("Test Workspace")
  state.workspaceHandle.set("test-workspace")
  state.description.set("Test description")
  state.image.set("")
  state.url.set("")
  for (const field of Object.values(workspaceFormField)) {
    updateFieldError(field, state[field].get(), errors)
  }
}

function validateOnChange(
  field: WorkspaceFormField,
  state: WorkspaceFormState,
  serverState: SignalObject<DocWorkspace>,
  errors: WorkspaceFormErrorState,
) {
  return debounce((value: string) => {
    autoFillHandle(field, value, state, serverState)
    updateFieldError(field, value, errors)
  }, debounceMs)
}

function autoFillHandle(
  field: WorkspaceFormField,
  value: string,
  state: WorkspaceFormState,
  serverState: SignalObject<DocWorkspace>,
) {
  if (field !== workspaceFormField.name) return
  const ss = serverState.get()
  if (ss.workspaceHandle) return
  const handle = handleGenerate(value)
  state.workspaceHandle.set(handle)
}

function updateFieldError(field: WorkspaceFormField, value: string, errors: WorkspaceFormErrorState) {
  const result = validateFieldResult(field, value)
  const errorSig = errors[field as keyof typeof errors]
  if (result.success) {
    errorSig.set("")
  } else {
    errorSig.set(result.issues[0].message)
  }
}

function validateFieldResult(field: WorkspaceFormField, value: string) {
  let schema
  if (field === workspaceFormField.name) {
    schema = workspaceDataSchemaFields.name
  } else if (field === workspaceFormField.workspaceHandle) {
    schema = workspaceDataSchemaFields.workspaceHandle
  } else if (field === workspaceFormField.description) {
    schema = workspaceDataSchemaFields.description
  } else if (field === workspaceFormField.image) {
    schema = workspaceDataSchemaFields.image
  } else if (field === workspaceFormField.url) {
    schema = workspaceDataSchemaFields.url
  }
  return a.safeParse(schema!, value)
}

//
// Actions
//

export type WorkspaceFormActions = {
  create?: WorkspaceFormCreateFn
  edit?: WorkspaceFormEditFn
  delete?: WorkspaceFormDelteFn
}
async function handleSubmit(
  e: SubmitEvent,
  isSaving: SignalObject<boolean>,
  serverState: SignalObject<DocWorkspace>,
  state: WorkspaceFormState,
  errors: WorkspaceFormErrorState,
  actions: WorkspaceFormActions,
): Promise<void> {
  e.preventDefault()

  const name = state.name.get()
  const workspaceHandle = state.workspaceHandle.get()
  const description = state.description.get()
  const image = state.image.get()
  const url = state.url.get()

  const nameResult = validateFieldResult(workspaceFormField.name, name)
  const handleResult = validateFieldResult(workspaceFormField.workspaceHandle, workspaceHandle)
  const descriptionResult = validateFieldResult(workspaceFormField.description, description)
  const imageResult = validateFieldResult(workspaceFormField.image, image)
  const urlResult = validateFieldResult(workspaceFormField.url, url)

  errors.name.set(nameResult.success ? "" : nameResult.issues[0].message)
  errors.workspaceHandle.set(handleResult.success ? "" : handleResult.issues[0].message)
  errors.description.set(descriptionResult.success ? "" : descriptionResult.issues[0].message)
  errors.image.set(imageResult.success ? "" : imageResult.issues[0].message)
  errors.url.set(urlResult.success ? "" : urlResult.issues[0].message)

  const isSuccess =
    nameResult.success && handleResult.success && descriptionResult.success && imageResult.success && urlResult.success

  if (!isSuccess) {
    if (!nameResult.success) {
      toastAdd({ title: nameResult.issues[0].message, icon: mdiAlertCircle, id: "name" })
    }
    if (!handleResult.success) {
      toastAdd({ title: handleResult.issues[0].message, icon: mdiAlertCircle, id: "handle" })
    }
    if (!descriptionResult.success) {
      toastAdd({ title: descriptionResult.issues[0].message, icon: mdiAlertCircle, id: "description" })
    }
    if (!imageResult.success) {
      toastAdd({ title: imageResult.issues[0].message, icon: mdiAlertCircle, id: "image" })
    }
    if (!urlResult.success) {
      toastAdd({ title: urlResult.issues[0].message, icon: mdiAlertCircle, id: "url" })
    }
    return
  }

  isSaving.set(true)

  if (actions.create) {
    const data: WorkspaceFormData = { name, workspaceHandle, description, image, url }
    await actions.create(data)
  }

  if (actions.edit) {
    const data: Partial<WorkspaceFormData> = {}
    const ss = serverState.get()
    if (name !== ss.name) {
      data.name = name
    }
    if (description !== ss.description) {
      data.description = description
    }
    if (image !== ss.image) {
      data.image = image
    }
    if (url !== ss.url) {
      data.url = url
    }

    if (Object.keys(data).length === 0) {
      const icon = mdiPenOff
      const title = ttt("No changes")
      const id = "form"
      toastAdd({ icon, title, id })
      isSaving.set(false)
      return
    }

    await actions.edit(data)
  }

  if (actions.delete) {
    await actions.delete()
  }

  isSaving.set(false)
}

export type WorkspaceFormCreateFn = (state: WorkspaceFormData) => Promise<void>
export type WorkspaceFormEditFn = (state: Partial<WorkspaceFormData>) => Promise<void>
export type WorkspaceFormDelteFn = () => Promise<void>

function createActions(
  mode: FormMode,
  workspaceHandle: string | undefined,
  navigate: NavigateTo,
): WorkspaceFormActions {
  const actions: WorkspaceFormActions = {}
  if (mode === formMode.add) {
    const addMutation = createMutation(api.workspace.workspaceCreateMutation)
    actions.create = async (data) => createAction(data, addMutation, navigate)
  }
  if (mode === formMode.edit) {
    const editMutation = createMutation(api.workspace.workspaceEditMutation)
    actions.edit = async (data) => editAction(data, workspaceHandle, mode, editMutation, navigate)
  }
  if (mode === formMode.remove) {
    const deleteMutation = createMutation(api.workspace.workspaceDeleteMutation)
    actions.delete = async () => removeAction(workspaceHandle, mode, deleteMutation, navigate)
  }
  return actions
}

interface WorkspaceCreateMutationProps extends WorkspaceDataModel, HasToken {}

interface WorkspaceEditMutationProps
  extends Partial<Omit<WorkspaceDataModel, "workspaceHandle">>,
    HasWorkspaceHandle,
    HasToken {}

interface WorkspaceRemoveMutationProps extends HasWorkspaceHandle, HasToken {}

async function createAction(
  data: WorkspaceFormData,
  addMutation: (data: WorkspaceCreateMutationProps) => Promise<Result<IdWorkspace>>,
  navigate: NavigateTo,
): Promise<void> {
  const workspaceIdResult = await addMutation({
    token: userTokenGet(),
    // data
    ...data,
  })
  if (!workspaceIdResult.success) {
    console.error(workspaceIdResult)
    toastAdd({ title: workspaceIdResult.errorMessage, variant: toastVariant.error })
    return
  }
  // const workspaceId = await getMutationAdd(p.session, state)
  const url = urlWorkspaceView(data.workspaceHandle)
  navigate(url)
}

async function editAction(
  data: Partial<WorkspaceFormData>,
  workspaceHandle: string | undefined,
  mode: FormMode,
  editMutation: (data: WorkspaceEditMutationProps) => Promise<Result<null>>,
  navigate: NavigateTo,
) {
  if (!workspaceHandle) {
    toastAdd({ title: "!workspaceHandle", variant: toastVariant.error })
    return
  }
  const editResult = await editMutation({
    // auth
    token: userTokenGet(),
    // data
    ...data,
    // id
    workspaceHandle,
  })
  if (!editResult.success) {
    console.error(editResult)
    toastAdd({ title: editResult.errorMessage, variant: toastVariant.error })
    return
  }
  navigate(getReturnPath(mode, workspaceHandle))
}
async function removeAction(
  workspaceHandle: string | undefined,
  mode: FormMode,
  deleteMutation: (data: WorkspaceRemoveMutationProps) => Promise<Result<null>>,
  navigate: NavigateTo,
) {
  if (!workspaceHandle) {
    toastAdd({ title: "!workspaceHandle", variant: toastVariant.error })
    return
  }
  const deleteResult = await deleteMutation({
    // auth
    token: userTokenGet(),
    // id
    workspaceHandle: workspaceHandle!,
  })
  if (!deleteResult.success) {
    console.error(deleteResult)
    toastAdd({ title: deleteResult.errorMessage, variant: toastVariant.error })
    return
  }
  navigate(getReturnPath(mode, workspaceHandle))
}

function getReturnPath(mode: FormMode, workspaceHandle?: string) {
  if (mode === formMode.edit && workspaceHandle) {
    return urlWorkspaceView(workspaceHandle)
  }
  return urlWorkspaceList()
}
