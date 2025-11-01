import type { DocOrg, IdOrg } from "@/org/org_convex/IdOrg"
import { orgDataSchemaFields } from "@/org/org_model/orgSchema"
import { orgFormField, type OrgFormField } from "@/org/org_ui/form/orgFormField"
import { debounceMs } from "@/utils/ui/debounceMs"
import { handleGenerate } from "@/utils/valibot/handleSchema"
import { mdiAlertCircle, mdiPenOff } from "@mdi/js"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import * as v from "valibot"
import { ttt } from "~ui/i18n/ttt"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"

export type OrgFormData = {
  orgHandle: string
  // data
  name: string
  description: string
  url: string
  image: string
}

export type OrgFormState = {
  orgHandle: SignalObject<string>
  // data
  name: SignalObject<string>
  description: SignalObject<string>
  url: SignalObject<string>
  image: SignalObject<string>
}

export type OrgFormErrorState = {
  orgHandle: SignalObject<string>
  // data
  name: SignalObject<string>
  description: SignalObject<string>
  url: SignalObject<string>
  image: SignalObject<string>
}

function orgCreateState(): OrgFormState {
  return {
    orgHandle: createSignalObject(""),
    // date
    name: createSignalObject(""),
    description: createSignalObject(""),
    url: createSignalObject(""),
    image: createSignalObject(""),
  }
}

export type OrgFormStateManagement = {
  isSaving: SignalObject<boolean>
  serverState: SignalObject<DocOrg>
  state: OrgFormState
  errors: OrgFormErrorState
  hasErrors: () => boolean
  fillTestData: () => void
  loadData: (data: DocOrg) => void
  validateOnChange: (field: OrgFormField) => Scheduled<[value: string]>
  handleSubmit: (e: SubmitEvent) => Promise<void>
}

function createOrgFormData(): OrgFormData {
  return { name: "", orgHandle: "", description: "", url: "", image: "" }
}

function createEmptyDocOrg(): DocOrg {
  const now = new Date()
  const iso = now.toISOString()
  return {
    ...createOrgFormData(),
    _id: "" as IdOrg,
    createdAt: iso,
    updatedAt: iso,
    _creationTime: now.getMilliseconds(),
  }
}

export type OrgFormCreateFn = (state: OrgFormData) => Promise<void>
export type OrgFormEditFn = (state: Partial<OrgFormData>) => Promise<void>
export type OrgFormDeleteFn = () => Promise<void>

export type OrgFormActions = {
  create?: OrgFormCreateFn
  edit?: OrgFormEditFn
  delete?: OrgFormDeleteFn
}

export function orgCreateFormStateManagement(actions: OrgFormActions): OrgFormStateManagement {
  const serverState = createSignalObject(createEmptyDocOrg())
  const isSaving = createSignalObject(false)
  const state = orgCreateState()
  const errors = orgCreateState()
  return {
    isSaving,
    serverState,
    state,
    loadData: (data: DocOrg) => loadData(data, serverState, state),
    errors,
    hasErrors: () => hasErrors(errors),
    fillTestData: () => fillTestData(state, errors),
    validateOnChange: (field: OrgFormField) => validateOnChange(field, state, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, isSaving, serverState, state, errors, actions),
  }
}

function loadData(data: DocOrg, serverState: SignalObject<DocOrg>, state: OrgFormState): void {
  serverState.set(data)
  state.name.set(data.name)
  state.orgHandle.set(data.orgHandle)
  state.description.set(data.description ?? "")
  state.url.set(data.url ?? "")
  state.image.set(data.image ?? "")
  console.log("loaded data", data)
}

function hasErrors(errors: OrgFormErrorState) {
  return (
    !!errors.name.get() ||
    !!errors.orgHandle.get() ||
    !!errors.description.get() ||
    !!errors.url.get() ||
    !!errors.image.get()
  )
}
function fillTestData(state: OrgFormState, errors: OrgFormErrorState) {
  const name = "Test Organization"
  state.name.set(name)
  const handle = handleGenerate(name)
  state.orgHandle.set(handle)
  state.description.set("Test description")
  state.url.set("https://example.com")
  state.image.set("https://adaptive-solid-ui.pages.dev/logo.svg")

  for (const field of Object.values(orgFormField)) {
    updateFieldError(field, state[field].get(), state, errors)
  }
}

function validateOnChange(field: OrgFormField, state: OrgFormState, errors: OrgFormErrorState) {
  return debounce((value: string) => {
    updateFieldError(field, value, state, errors)
    autoFillHandle(field, value, state, errors)
  }, debounceMs)
}

function updateFieldError(field: OrgFormField, value: string, state: OrgFormState, errors: OrgFormErrorState) {
  const result = validateFieldResult(field, value)
  const errorSig = errors[field as keyof typeof errors]
  if (result.success) {
    errorSig.set("")
  } else {
    errorSig.set(result.issues[0].message)
    console.log({ field, value, message: result.issues[0].message })
  }
}

function autoFillHandle(field: OrgFormField, value: string, state: OrgFormState, errors: OrgFormErrorState) {
  if (field !== orgFormField.name) return
  const handle = handleGenerate(value)
  state.orgHandle.set(handle)
  updateFieldError(orgFormField.orgHandle, handle, state, errors)
}

function validateFieldResult(field: OrgFormField, value: string) {
  const schema = orgDataSchemaFields[field]
  return v.safeParse(schema, value)
}

async function handleSubmit(
  e: SubmitEvent,
  isSaving: SignalObject<boolean>,
  serverState: SignalObject<DocOrg>,
  state: OrgFormState,
  errors: OrgFormErrorState,
  actions: OrgFormActions,
): Promise<void> {
  e.preventDefault()

  const name = state.name.get()
  const orgHandle = state.orgHandle.get()
  const description = state.description.get()
  const url = state.url.get()
  const image = state.image.get()

  const nameResult = validateFieldResult(orgFormField.name, name)
  const handleResult = validateFieldResult(orgFormField.orgHandle, orgHandle)
  const descriptionResult = validateFieldResult(orgFormField.description, description)
  const urlResult = validateFieldResult(orgFormField.url, url)
  const imageResult = validateFieldResult(orgFormField.image, image)

  errors.name.set(nameResult.success ? "" : nameResult.issues[0].message)
  errors.orgHandle.set(handleResult.success ? "" : handleResult.issues[0].message)
  errors.description.set(descriptionResult.success ? "" : descriptionResult.issues[0].message)
  errors.url.set(urlResult.success ? "" : urlResult.issues[0].message)
  errors.image.set(imageResult.success ? "" : imageResult.issues[0].message)

  const isSuccess =
    nameResult.success && handleResult.success && descriptionResult.success && urlResult.success && imageResult.success

  if (!isSuccess) {
    if (!nameResult.success) {
      toastAdd({ title: nameResult.issues[0].message, icon: mdiAlertCircle, id: orgFormField.name })
    }
    if (!handleResult.success) {
      toastAdd({ title: handleResult.issues[0].message, icon: mdiAlertCircle, id: orgFormField.orgHandle })
    }
    if (!descriptionResult.success) {
      toastAdd({ title: descriptionResult.issues[0].message, icon: mdiAlertCircle, id: orgFormField.description })
    }
    if (!urlResult.success) {
      toastAdd({ title: urlResult.issues[0].message, icon: mdiAlertCircle, id: orgFormField.url })
    }
    if (!imageResult.success) {
      toastAdd({ title: imageResult.issues[0].message, icon: mdiAlertCircle, id: orgFormField.image })
    }
    return
  }

  isSaving.set(true)

  if (actions.create) {
    const data: OrgFormData = { name, orgHandle, description, url, image }
    await actions.create(data)
  }

  if (actions.edit) {
    const data: Partial<OrgFormData> = {}
    const ss = serverState.get()
    if (name !== ss.name) {
      data.name = name
    }
    if (description !== ss.description) {
      data.description = description
    }
    if (url !== ss.url) {
      data.url = url
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
