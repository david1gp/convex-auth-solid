import type { DocOrg } from "@/org/convex/IdOrg"
import { orgDataSchemaFields } from "@/org/model/orgSchema"
import { orgFormField, type OrgFormField } from "@/org/ui/form/orgFormField"
import { debounceMs } from "@/utils/ui/debounceMs"
import { mdiAlertCircle } from "@mdi/js"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import * as v from "valibot"
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
  state: OrgFormState
  errors: OrgFormErrorState
  hasErrors: () => boolean
  fillTestData: () => void
  loadData: (data: DocOrg) => void
  validateOnChange: (field: OrgFormField) => Scheduled<[value: string]>
  handleSubmit: (e: SubmitEvent) => Promise<void>
}

export type OrgFormSubmitAction = (state: OrgFormData) => Promise<void>

export function orgCreateFormStateManagement(onSubmit: OrgFormSubmitAction): OrgFormStateManagement {
  const isSaving = createSignalObject(false)
  const state = orgCreateState()
  const errors = orgCreateState()
  return {
    isSaving,
    state,
    loadData: (data: DocOrg) => loadData(data, state),
    errors,
    hasErrors: () => hasErrors(errors),
    fillTestData: () => fillTestData(state),
    validateOnChange: (field: OrgFormField) => validateOnChange(field, state, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, isSaving, state, errors, onSubmit),
  }
}

function loadData(data: DocOrg, state: OrgFormState): void {
  state.name.set(data.name)
  state.orgHandle.set(data.orgHandle)
  state.description.set(data.description ?? "")
  state.url.set(data.url ?? "")
  state.image.set(data.image ?? "")
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
function fillTestData(state: OrgFormState) {
  state.name.set("Test Organization")
  state.orgHandle.set("test-organization")
  state.description.set("Test description")
  state.url.set("")
  state.image.set("")
}

function validateOnChange(field: OrgFormField, state: OrgFormState, errors: OrgFormErrorState) {
  return debounce((value: string) => {
    const result = validateField(field, value)
    const errorSig = errors[field as keyof typeof errors]
    if (result.success) {
      errorSig.set("")
    } else {
      errorSig.set(result.issues[0].message)
    }
  }, debounceMs)
}

function validateField(field: OrgFormField, value: string) {
  let schema
  if (field === orgFormField.name) {
    schema = orgDataSchemaFields.name
  } else if (field === orgFormField.orgHandle) {
    schema = orgDataSchemaFields.orgHandle
  } else if (field === orgFormField.description) {
    schema = orgDataSchemaFields.description
  } else if (field === orgFormField.url) {
    schema = orgDataSchemaFields.url
  } else if (field === orgFormField.image) {
    schema = orgDataSchemaFields.image
  }
  return v.safeParse(schema!, value)
}

async function handleSubmit(
  e: SubmitEvent,
  isSaving: SignalObject<boolean>,
  state: OrgFormState,
  errors: OrgFormErrorState,
  onSubmit: OrgFormSubmitAction,
): Promise<void> {
  e.preventDefault()

  const name = state.name.get()
  const orgHandle = state.orgHandle.get()
  const description = state.description.get()
  const url = state.url.get()
  const image = state.image.get()

  const nameResult = validateField(orgFormField.name, name)
  const handleResult = validateField(orgFormField.orgHandle, orgHandle)
  const descriptionResult = validateField(orgFormField.description, description)
  const urlResult = validateField(orgFormField.url, url)
  const imageResult = validateField(orgFormField.image, image)

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

  const data: OrgFormData = { name, orgHandle, description, url, image }
  isSaving.set(true)
  await onSubmit(data)
  isSaving.set(false)
}
