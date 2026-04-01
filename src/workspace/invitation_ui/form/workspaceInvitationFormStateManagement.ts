import { api } from "#convex/_generated/api.js"
import type { Result } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import type { DocWorkspaceInvitation, IdWorkspaceInvitation } from "#src/workspace/invitation_convex/IdWorkspaceInvitation.ts"
import {
    workspaceInvitationFormConfig,
    workspaceInvitationFormField,
    type WorkspaceInvitationFormField,
} from "#src/workspace/invitation_ui/form/workspaceInvitationFormField.ts"
import {
    workspaceInvitationFormLocalStorage,
    type WorkspaceInvitationFormData,
} from "#src/workspace/invitation_ui/form/workspaceInvitationFormLocalStorage.ts"
import { urlWorkspaceInvitationList } from "#src/workspace/invitation_url/urlWorkspaceInvitation.ts"
import { workspaceRole, type WorkspaceRole } from "#src/workspace/workspace_model_field/workspaceRole.ts"
import { createMutation } from "#src/utils/convex_client/createMutation.ts"
import { navigateTo } from "#src/utils/router/navigateTo.ts"
import { debounceMs } from "#src/utils/ui/debounceMs.ts"
import type { HasToken } from "#src/utils/ui/HasToken.ts"
import { formMode, type FormMode } from "#ui/input/form/formMode.ts"
import { toastAdd } from "#ui/interactive/toast/toastAdd.ts"
import { toastVariant } from "#ui/interactive/toast/toastVariant.ts"
import { createSignalObject, type SignalObject } from "#ui/utils/createSignalObject.ts"
import { mdiAlertCircle } from "@mdi/js"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import * as a from "valibot"

export type WorkspaceInvitationFormState = {
  invitedEmail: SignalObject<string>
  role: SignalObject<string>
}

export type WorkspaceInvitationFormErrorState = {
  invitedEmail: SignalObject<string>
  role: SignalObject<string>
}

function createWorkspaceInvitationFormState(): WorkspaceInvitationFormState {
  return {
    invitedEmail: createSignalObject(""),
    role: createSignalObject<string>(workspaceRole.member),
  }
}

function createWorkspaceInvitationErrorState(): WorkspaceInvitationFormErrorState {
  return {
    invitedEmail: createSignalObject(""),
    role: createSignalObject(""),
  }
}

export type WorkspaceInvitationFormStateManagement = {
  mode: FormMode
  isSubmitting: SignalObject<boolean>
  serverState: SignalObject<DocWorkspaceInvitation>
  state: WorkspaceInvitationFormState
  errors: WorkspaceInvitationFormErrorState
  hasErrors: () => boolean
  fillTestData: () => void
  loadData: (data: DocWorkspaceInvitation) => void
  validateOnChange: (field: WorkspaceInvitationFormField) => Scheduled<[value: string]>
  handleSubmit: (e: SubmitEvent) => Promise<void>
  debouncedSave: () => void
}

function createEmptyDocWorkspaceInvitation(): DocWorkspaceInvitation {
  const now = new Date()
  const iso = now.toISOString()
  return {
    _id: "" as IdWorkspaceInvitation,
    workspaceHandle: "",
    invitedEmail: "",
    invitationCode: "",
    role: workspaceRole.member,
    invitedBy: "",
    status: "pending",
    expiresAt: iso,
    createdAt: iso,
    updatedAt: iso,
    _creationTime: now.getMilliseconds(),
  }
}

export type WorkspaceInvitationFormAddFn = (state: WorkspaceInvitationFormData) => Promise<void>
export type WorkspaceInvitationFormEditFn = (state: WorkspaceInvitationFormData) => Promise<void>
export type WorkspaceInvitationFormRemoveFn = () => Promise<void>

type WorkspaceInvitationFormActions = {
  add?: WorkspaceInvitationFormAddFn
  edit?: WorkspaceInvitationFormEditFn
  remove?: WorkspaceInvitationFormRemoveFn
}

export function workspaceInvitationFormStateManagement(
  mode: FormMode,
  workspaceHandle: string,
  invitationCode?: string,
  workspaceInvitation?: DocWorkspaceInvitation,
): WorkspaceInvitationFormStateManagement {
  const actions: WorkspaceInvitationFormActions = createActions(mode, workspaceHandle, invitationCode)
  const serverState = createSignalObject(createEmptyDocWorkspaceInvitation())
  const isSubmitting = createSignalObject(false)
  const state = createWorkspaceInvitationFormState()

  if (mode === formMode.add) {
    workspaceInvitationFormLocalStorage.loadData((data) => loadPartialData(data, state))
  } else if (workspaceInvitation) {
    loadData(workspaceInvitation, serverState, state)
  }

  const errors = createWorkspaceInvitationErrorState()

  const debouncedSave = workspaceInvitationFormLocalStorage.createDebounceSave(mode, state)

  return {
    mode,
    isSubmitting,
    serverState,
    state,
    loadData: (data: DocWorkspaceInvitation) => loadData(data, serverState, state),
    errors,
    hasErrors: () => hasErrors(errors),
    fillTestData: () => fillTestData(state, errors),
    validateOnChange: (field: WorkspaceInvitationFormField) => {
      debouncedSave()
      return validateOnChange(field, state, errors)
    },
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, isSubmitting, serverState, state, errors, actions),
    debouncedSave,
  }
}

function loadData(
  data: DocWorkspaceInvitation,
  serverState: SignalObject<DocWorkspaceInvitation>,
  state: WorkspaceInvitationFormState,
): void {
  serverState.set(data)
  state.invitedEmail.set(data.invitedEmail)
  state.role.set(data.role)
}

function loadPartialData(data: Partial<WorkspaceInvitationFormData>, state: WorkspaceInvitationFormState): void {
  if (data.invitedEmail) state.invitedEmail.set(data.invitedEmail)
  if (data.role) state.role.set(data.role as WorkspaceRole)
}

function hasErrors(errors: WorkspaceInvitationFormErrorState) {
  return !!errors.invitedEmail.get() || !!errors.role.get()
}

function fillTestData(state: WorkspaceInvitationFormState, errors: WorkspaceInvitationFormErrorState) {
  state.invitedEmail.set("test@example.com")
  state.role.set("member")

  for (const field of Object.values(workspaceInvitationFormField)) {
    updateFieldError(field, state[field as keyof typeof state].get(), state, errors)
  }
}

function validateOnChange(
  field: WorkspaceInvitationFormField,
  state: WorkspaceInvitationFormState,
  errors: WorkspaceInvitationFormErrorState,
) {
  return debounce((value: string) => {
    updateFieldError(field, value, state, errors)
  }, debounceMs)
}

function updateFieldError(
  field: WorkspaceInvitationFormField,
  value: string,
  state: WorkspaceInvitationFormState,
  errors: WorkspaceInvitationFormErrorState,
) {
  const result = validateFieldResult(field, value)
  const errorSig = errors[field as keyof typeof errors]
  if (result.success) {
    errorSig.set("")
  } else {
    errorSig.set(result.issues[0].message)
  }
}

function validateFieldResult(field: WorkspaceInvitationFormField, value: string) {
  const schema = workspaceInvitationFormConfig[field].schema
  return a.safeParse(schema!, value)
}

async function handleSubmit(
  e: SubmitEvent,
  isSubmitting: SignalObject<boolean>,
  serverState: SignalObject<DocWorkspaceInvitation>,
  state: WorkspaceInvitationFormState,
  errors: WorkspaceInvitationFormErrorState,
  actions: WorkspaceInvitationFormActions,
): Promise<void> {
  e.preventDefault()

  if (isSubmitting.get()) {
    const title = ttc("Submission in progress, please wait")
    console.info(title)
    return
  }

  const invitedEmail = state.invitedEmail.get()
  const role = state.role.get()

  const invitedEmailResult = validateFieldResult(workspaceInvitationFormField.invitedEmail, invitedEmail)
  const roleResult = validateFieldResult(workspaceInvitationFormField.role, role)

  errors.invitedEmail.set(invitedEmailResult.success ? "" : invitedEmailResult.issues[0].message)
  errors.role.set(roleResult.success ? "" : roleResult.issues[0].message)

  const isSuccess = invitedEmailResult.success && roleResult.success

  if (!isSuccess) {
    if (!invitedEmailResult.success) {
      toastAdd({
        title: invitedEmailResult.issues[0].message,
        icon: mdiAlertCircle,
        id: workspaceInvitationFormField.invitedEmail,
      })
    }
    if (!roleResult.success) {
      toastAdd({ title: roleResult.issues[0].message, icon: mdiAlertCircle, id: workspaceInvitationFormField.role })
    }
    return
  }

  isSubmitting.set(true)

  if (actions.add) {
    const data: WorkspaceInvitationFormData = { invitedEmail, role: role as WorkspaceRole }
    await actions.add(data)
  }

  if (actions.edit) {
    const data: WorkspaceInvitationFormData = { invitedEmail, role: role as WorkspaceRole }
    await actions.edit(data)
  }

  if (actions.remove) {
    await actions.remove()
  }

  isSubmitting.set(false)
}

//
// Actions
//

function createActions(
  mode: FormMode,
  workspaceHandle: string,
  invitationCode: string | undefined,
): WorkspaceInvitationFormActions {
  const actions: WorkspaceInvitationFormActions = {}
  if (mode === formMode.add) {
    const addMutation = createMutation(api.workspace.workspaceInvitation20InitMutation)
    actions.add = async (data) => addAction(data, workspaceHandle, addMutation)
  }
  if (mode === formMode.edit) {
    // Edit functionality not implemented for invitations yet
  }
  if (mode === formMode.remove) {
    const dismissMutation = createMutation(api.workspace.workspaceInvitation60DismissMutation)
    actions.remove = async () => removeAction(workspaceHandle, invitationCode, dismissMutation)
  }
  return actions
}

interface WorkspaceInvitationCreateMutationProps extends HasToken {
  workspaceHandle: string
  invitedEmail: string
  role: WorkspaceRole
}

interface WorkspaceInvitationDismissActionProps extends HasToken {
  invitationCode: string
}

async function addAction(
  data: WorkspaceInvitationFormData,
  workspaceHandle: string,
  addMutation: (data: WorkspaceInvitationCreateMutationProps) => Promise<Result<string>>,
): Promise<void> {
  const invitationIdResult = await addMutation({
    token: userTokenGet(),
    workspaceHandle,
    invitedEmail: data.invitedEmail,
    role: data.role as WorkspaceRole,
  })
  if (!invitationIdResult.success) {
    console.error(invitationIdResult)
    toastAdd({ title: invitationIdResult.errorMessage, variant: toastVariant.error })
    return
  }
  workspaceInvitationFormLocalStorage.clearLocalStorage()
  const url = urlWorkspaceInvitationList(workspaceHandle)
  navigateTo(url)
}

async function removeAction(
  workspaceHandle: string,
  invitationCode: string | undefined,
  dismissAction: (data: WorkspaceInvitationDismissActionProps) => Promise<Result<null>>,
) {
  if (!invitationCode) {
    toastAdd({ title: "!invitationCode", variant: toastVariant.error })
    return
  }
  const result = await dismissAction({
    token: userTokenGet(),
    invitationCode,
  })
  if (!result.success) {
    console.error(result)
    toastAdd({ title: result.errorMessage, variant: toastVariant.error })
    return
  }
  const url = urlWorkspaceInvitationList(workspaceHandle)
  navigateTo(url)
}
