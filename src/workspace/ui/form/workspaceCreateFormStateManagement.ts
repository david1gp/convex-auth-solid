import { debounceMs } from "@/utils/ui/debounceMs"
import type { DocWorkspace, IdWorkspace } from "@/workspace/convex/IdWorkspace"
import { workspaceDataSchemaFields } from "@/workspace/model/workspaceSchema"
import { mdiAlertCircle, mdiPenOff } from "@mdi/js"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import * as v from "valibot"
import { ttt } from "~ui/i18n/ttt"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"

export type WorkspaceFormField = keyof typeof workspaceFormField

export const workspaceFormField = {
  // id
  workspaceHandle: "workspaceHandle",
  // data
  name: "name",
  description: "description",
  image: "image",
} as const

export type WorkspaceFormData = {
  workspaceHandle: string
  // data
  name: string
  description: string
  image: string
}

export type WorkspaceFormState = {
  name: SignalObject<string>
  workspaceHandle: SignalObject<string>
  description: SignalObject<string>
  image: SignalObject<string>
}

export type WorkspaceFormErrorState = {
  name: SignalObject<string>
  workspaceHandle: SignalObject<string>
  description: SignalObject<string>
  image: SignalObject<string>
}

function workspaceCreateState(): WorkspaceFormState {
  return {
    name: createSignalObject(""),
    workspaceHandle: createSignalObject(""),
    description: createSignalObject(""),
    image: createSignalObject(""),
  }
}

export type WorkspaceFormStateManagement = {
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
  return { name: "", workspaceHandle: "", description: "", image: "" }
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

export type WorkspaceFormCreateFn = (state: WorkspaceFormData) => Promise<void>
export type WorkspaceFormEditFn = (state: Partial<WorkspaceFormData>) => Promise<void>
export type WorkspaceFormDelteFn = () => Promise<void>

export type WorkspaceFormActions = {
  create?: WorkspaceFormCreateFn
  edit?: WorkspaceFormEditFn
  delete?: WorkspaceFormDelteFn
}

export function workspaceCreateFormStateManagement(actions: WorkspaceFormActions): WorkspaceFormStateManagement {
  const serverState = createSignalObject(createEmptyDocWorkspace())
  const isSaving = createSignalObject(false)
  const state = workspaceCreateState()
  const errors = workspaceCreateState()
  return {
    isSaving,
    serverState,
    state,
    loadData: (data: DocWorkspace) => loadData(data, serverState, state),
    errors,
    hasErrors: () => hasErrors(errors),
    fillTestData: () => fillTestData(state, errors),
    validateOnChange: (field: WorkspaceFormField) => validateOnChange(field, state, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, isSaving, serverState, state, errors, actions),
  }
}

function loadData(data: DocWorkspace, serverState: SignalObject<DocWorkspace>, state: WorkspaceFormState): void {
  serverState.set(data)
  state.name.set(data.name)
  state.workspaceHandle.set(data.workspaceHandle)
  state.description.set(data.description ?? "")
  state.image.set(data.image ?? "")
}

function hasErrors(errors: WorkspaceFormErrorState) {
  return !!errors.name.get() || !!errors.workspaceHandle.get() || !!errors.description.get() || !!errors.image.get()
}
function fillTestData(state: WorkspaceFormState, errors: WorkspaceFormErrorState) {
  state.name.set("Test Workspace")
  state.workspaceHandle.set("test-workspace")
  state.description.set("Test description")
  state.image.set("")
  for (const field of Object.values(workspaceFormField)) {
    updateFieldError(field, state[field].get(), state, errors)
  }
}

function validateOnChange(field: WorkspaceFormField, state: WorkspaceFormState, errors: WorkspaceFormErrorState) {
  return debounce((value: string) => {
    updateFieldError(field, value, state, errors)
  }, debounceMs)
}

function updateFieldError(
  field: WorkspaceFormField,
  value: string,
  state: WorkspaceFormState,
  errors: WorkspaceFormErrorState,
) {
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
  }
  return v.safeParse(schema!, value)
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

  const nameResult = validateFieldResult(workspaceFormField.name, name)
  const handleResult = validateFieldResult(workspaceFormField.workspaceHandle, workspaceHandle)
  const descriptionResult = validateFieldResult(workspaceFormField.description, description)
  const imageResult = validateFieldResult(workspaceFormField.image, image)

  errors.name.set(nameResult.success ? "" : nameResult.issues[0].message)
  errors.workspaceHandle.set(handleResult.success ? "" : handleResult.issues[0].message)
  errors.description.set(descriptionResult.success ? "" : descriptionResult.issues[0].message)
  errors.image.set(imageResult.success ? "" : imageResult.issues[0].message)

  const isSuccess = nameResult.success && handleResult.success && descriptionResult.success && imageResult.success

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
    return
  }

  isSaving.set(true)

  if (actions.create) {
    const data: WorkspaceFormData = { name, workspaceHandle, description, image }
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
