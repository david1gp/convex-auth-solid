import { language, languageOrNone, type Language, type LanguageOrNone } from "@/app/i18n/language"
import { ttc } from "@/app/i18n/ttc"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { FileModel } from "@/file/model/FileModel"
import { fileFormConfig, fileFormField, type FileFormField } from "@/file/ui/form/fileFormField"
import { urlResourceList, urlResourceView } from "@/resource/url/urlResource"
import { createMutation } from "@/utils/convex_client/createMutation"
import { navigateTo } from "@/utils/router/navigateTo"
import { debounceMs } from "@/utils/ui/debounceMs"
import type { HasToken } from "@/utils/ui/HasToken"
import { api } from "@convex/_generated/api"
import { mdiAlertCircle, mdiPenOff } from "@mdi/js"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import * as a from "valibot"
import { formMode, type FormMode } from "~ui/input/form/formMode"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"
import type { Result } from "~utils/result/Result"

export type FileFormData = {
  displayName: string
  language?: LanguageOrNone
}

export type FileFormState = {
  displayName: SignalObject<string>
  language: SignalObject<string>
}

export type FileFormErrorState = {
  displayName: SignalObject<string>
  language: SignalObject<string>
}

function fileCreateState(): FileFormState {
  return {
    displayName: createSignalObject(""),
    language: createSignalObject<string>(""),
  }
}

export type FormModeEditOrDelete = typeof formMode.edit | typeof formMode.remove

export type FileFormStateManagement = {
  mode: FormModeEditOrDelete
  isSubmitting: SignalObject<boolean>
  serverState: SignalObject<FileModel>
  state: FileFormState
  errors: FileFormErrorState
  actions: FileFormActions
  hasErrors: () => boolean
  fillTestData: () => void
  loadData: (data: FileModel) => void
  validateOnChange: (field: FileFormField) => Scheduled<[value: string | number | undefined]>
  handleSubmit: (e: SubmitEvent) => Promise<void>
}

function createFileFormData(): FileFormData {
  return {
    displayName: "",
    language: language.en,
  }
}

function createEmptyFile(): FileModel {
  const now = new Date()
  const iso = now.toISOString()
  return {
    ...createFileFormData(),
    fileId: "",
    resourceId: "",
    url: "",
    fileSize: 0,
    language: language.en,
    contentType: "",
    createdAt: iso,
    updatedAt: iso,
  }
}

export function fileFormStateManagement(mode: FormModeEditOrDelete, file: FileModel): FileFormStateManagement {
  const actions: FileFormActions = createActions(mode, file)
  const serverState = createSignalObject(createEmptyFile())
  const isSubmitting = createSignalObject(false)
  const state = fileCreateState()
  if (file) {
    loadData(file, serverState, state)
  }
  const errors = fileCreateState()
  return {
    mode,
    isSubmitting,
    serverState,
    state,
    errors,
    actions,
    hasErrors: () => hasErrors(errors),
    fillTestData: () => fillTestData(state, errors),
    loadData: (data: FileModel) => loadData(data, serverState, state),
    validateOnChange: (field: FileFormField) => validateOnChange(field, state, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, isSubmitting, serverState, state, errors, actions),
  }
}

function loadData(data: FileModel, serverState: SignalObject<FileModel>, state: FileFormState): void {
  serverState.set(data)
  state.displayName.set(data.displayName ?? "")
  state.language.set(data.language ?? language.en)
}

function hasErrors(errors: FileFormErrorState) {
  return !!(errors.displayName.get() || errors.language.get())
}

function fillTestData(state: FileFormState, errors: FileFormErrorState) {
  state.displayName.set("test-file.pdf")
  state.language.set(language.en)
  for (const field of Object.values(fileFormField)) {
    updateFieldError(field, state[field as keyof typeof state].get(), errors)
  }
}

function validateOnChange(field: FileFormField, state: FileFormState, errors: FileFormErrorState) {
  return debounce((value: string | number | undefined) => {
    updateFieldError(field, value, errors)
  }, debounceMs)
}

function updateFieldError(field: FileFormField, value: string | number | undefined, errors: FileFormErrorState) {
  const result = validateFieldResult(field, value)
  const errorSig = errors[field as keyof typeof errors]
  if (result.success) {
    errorSig.set("")
  } else {
    errorSig.set(result.issues[0].message)
  }
}

function validateFieldResult(field: FileFormField, value: string | number | undefined) {
  const schema = fileFormConfig[field].schema
  return a.safeParse(schema!, value)
}

//
// Actions
//

export type FileFormActions = {
  edit?: FileFormEditFn
  delete?: FileFormDeleteFn
}

async function handleSubmit(
  e: SubmitEvent,
  isSubmitting: SignalObject<boolean>,
  serverState: SignalObject<FileModel>,
  state: FileFormState,
  errors: FileFormErrorState,
  actions: FileFormActions,
): Promise<void> {
  e.preventDefault()

  if (isSubmitting.get()) {
    const title = ttc("Submission in progress, please wait")
    console.info(title)
    return
  }

  const displayName = state.displayName.get()
  const language = state.language.get()

  const displayNameResult = validateFieldResult(fileFormField.displayName, displayName)
  const languageResult = validateFieldResult(fileFormField.language, language)

  errors.displayName.set(displayNameResult.success ? "" : displayNameResult.issues[0].message)
  errors.language.set(languageResult.success ? "" : languageResult.issues[0].message)

  const isSuccess = displayNameResult.success && languageResult.success

  if (!isSuccess) {
    if (!displayNameResult.success) {
      toastAdd({ title: displayNameResult.issues[0].message, icon: mdiAlertCircle, id: "fileId" })
    }
    if (!languageResult.success) {
      toastAdd({ title: languageResult.issues[0].message, icon: mdiAlertCircle, id: "language" })
    }
    return
  }

  isSubmitting.set(true)

  if (actions.edit) {
    const data: Partial<FileFormData> = {}
    const ss = serverState.get()
    if (displayName !== ss.fileId) {
      data.displayName = displayName
    }
    if (language !== ss.language) {
      data.language = language === "" ? languageOrNone.none : (language as LanguageOrNone)
    }

    if (Object.keys(data).length === 0) {
      const icon = mdiPenOff
      const title = ttc("No changes")
      const id = "form"
      toastAdd({ icon, title, id })
      isSubmitting.set(false)
      return
    }

    await actions.edit(data)
  }

  if (actions.delete) {
    await actions.delete()
  }

  isSubmitting.set(false)
}

export type FileFormEditFn = (state: Partial<FileFormData>) => Promise<void>
export type FileFormDeleteFn = () => Promise<void>

function createActions(mode: FormMode, file: FileModel): FileFormActions {
  const actions: FileFormActions = {}
  if (mode === formMode.edit) {
    const editMutation = createMutation(api.file.fileEditMutation)
    actions.edit = async (data) => editAction(data, file, mode, editMutation)
  }
  if (mode === formMode.remove) {
    const deleteMutation = createMutation(api.file.fileDeleteMutation)
    actions.delete = async () => removeAction(file, deleteMutation)
  }
  return actions
}

interface FileEditMutationProps extends HasToken {
  fileId: string
  displayName?: string
  language?: Language
}

interface FileRemoveMutationProps extends HasToken {
  fileId: string
}

async function editAction(
  data: Partial<FileFormData>,
  file: FileModel,
  mode: FormMode,
  editMutation: (data: FileEditMutationProps) => Promise<Result<null>>,
) {
  if (!file) {
    toastAdd({ title: "!file", variant: toastVariant.error })
    return
  }
  const editData: FileEditMutationProps = {
    fileId: file.fileId,
    // resourceId: file.resourceId,
    token: userTokenGet(),
    displayName: data.displayName,
  }
  if (data.language) {
    editData.language = data.language as Language
  }
  const editResult = await editMutation(editData)
  if (!editResult.success) {
    console.error(editResult)
    toastAdd({ title: editResult.errorMessage, variant: toastVariant.error })
    return
  }
  const url = getReturnPath(mode, file.resourceId)
  navigateTo(url)
}

async function removeAction(file: FileModel, deleteMutation: (data: FileRemoveMutationProps) => Promise<Result<null>>) {
  if (!file) {
    toastAdd({ title: "!file", variant: toastVariant.error })
    return
  }
  const deleteResult = await deleteMutation({
    token: userTokenGet(),
    fileId: file.fileId,
  })
  if (!deleteResult.success) {
    console.error(deleteResult)
    toastAdd({ title: deleteResult.errorMessage, variant: toastVariant.error })
    return
  }
  const url = getReturnPath(formMode.remove, file.resourceId)
  navigateTo(url)
}

function getReturnPath(mode: FormMode, resourceId?: string) {
  if (resourceId) {
    return urlResourceView(resourceId)
  }
  return urlResourceList()
}
