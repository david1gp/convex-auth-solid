import { debounceMs } from "@/utils/ui/debounceMs"
import type { DocWorkspace } from "@/workspace/convex/IdWorkspace"
import { workspaceDataSchemaFields } from "@/workspace/model/workspaceSchema"
import { mdiAlertCircle } from "@mdi/js"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import * as v from "valibot"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"

export type WorkspaceFormField = keyof typeof workspaceFormField

export const workspaceFormField = {
  name: "name",
  slug: "slug",
  description: "description",
  image: "image",
} as const

export type WorkspaceFormData = {
  name: string
  slug: string
  description: string
  image: string
}

export type WorkspaceFormState = {
  name: SignalObject<string>
  slug: SignalObject<string>
  description: SignalObject<string>
  image: SignalObject<string>
}

export type WorkspaceFormErrorState = {
  name: SignalObject<string>
  slug: SignalObject<string>
  description: SignalObject<string>
  image: SignalObject<string>
}

function workspaceCreateState(): WorkspaceFormState {
  return {
    name: createSignalObject(""),
    slug: createSignalObject(""),
    description: createSignalObject(""),
    image: createSignalObject(""),
  }
}

export type WorkspaceFormStateManagement = {
  isSaving: SignalObject<boolean>
  state: WorkspaceFormState
  errors: WorkspaceFormErrorState
  hasErrors: () => boolean
  fillTestData: () => void
  loadData: (data: DocWorkspace) => void
  validateOnChange: (field: WorkspaceFormField) => Scheduled<[value: string]>
  handleSubmit: (e: SubmitEvent) => Promise<void>
}

export type WorkspaceFormSubmitAction = (state: WorkspaceFormData) => Promise<void>

export function workspaceCreateFormStateManagement(onSubmit: WorkspaceFormSubmitAction): WorkspaceFormStateManagement {
  const isSaving = createSignalObject(false)
  const state = workspaceCreateState()
  const errors = workspaceCreateState()
  return {
    isSaving,
    state,
    loadData: (data: DocWorkspace) => loadData(data, state),
    errors,
    hasErrors: () => hasErrors(errors),
    fillTestData: () => fillTestData(state),
    validateOnChange: (field: WorkspaceFormField) => validateOnChange(field, state, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, isSaving, state, errors, onSubmit),
  }
}

function loadData(data: DocWorkspace, state: WorkspaceFormState): void {
  state.name.set(data.name)
  state.slug.set(data.slug)
  state.description.set(data.description ?? "")
  state.image.set(data.image ?? "")
}

function hasErrors(errors: WorkspaceFormErrorState) {
  return !!errors.name.get() || !!errors.slug.get() || !!errors.description.get() || !!errors.image.get()
}
function fillTestData(state: WorkspaceFormState) {
  state.name.set("Test Workspace")
  state.slug.set("test-workspace")
  state.description.set("Test description")
  state.image.set("")
}

function validateOnChange(field: WorkspaceFormField, state: WorkspaceFormState, errors: WorkspaceFormErrorState) {
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

function validateField(field: WorkspaceFormField, value: string) {
  let schema
  if (field === workspaceFormField.name) {
    schema = workspaceDataSchemaFields.name
  } else if (field === workspaceFormField.slug) {
    schema = workspaceDataSchemaFields.slug
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
  state: WorkspaceFormState,
  errors: WorkspaceFormErrorState,
  onSubmit: WorkspaceFormSubmitAction,
): Promise<void> {
  e.preventDefault()

  const name = state.name.get()
  const slug = state.slug.get()
  const description = state.description.get()
  const image = state.image.get()

  const nameResult = validateField("name", name)
  const slugResult = validateField("slug", slug)
  const descriptionResult = validateField("description", description)
  const imageResult = validateField("image", image)

  errors.name.set(nameResult.success ? "" : nameResult.issues[0].message)
  errors.slug.set(slugResult.success ? "" : slugResult.issues[0].message)
  errors.description.set(descriptionResult.success ? "" : descriptionResult.issues[0].message)
  errors.image.set(imageResult.success ? "" : imageResult.issues[0].message)

  const isSuccess = nameResult.success && slugResult.success && descriptionResult.success && imageResult.success

  if (!isSuccess) {
    if (!nameResult.success) {
      toastAdd({ title: nameResult.issues[0].message, icon: mdiAlertCircle, id: "name" })
    }
    if (!slugResult.success) {
      toastAdd({ title: slugResult.issues[0].message, icon: mdiAlertCircle, id: "slug" })
    }
    if (!descriptionResult.success) {
      toastAdd({ title: descriptionResult.issues[0].message, icon: mdiAlertCircle, id: "description" })
    }
    if (!imageResult.success) {
      toastAdd({ title: imageResult.issues[0].message, icon: mdiAlertCircle, id: "image" })
    }
    return
  }

  const data: WorkspaceFormData = { name, slug, description, image }
  isSaving.set(true)
  await onSubmit(data)
  isSaving.set(false)
}
