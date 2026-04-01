import { api } from "#convex/_generated/api.js"
import type { Result } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import type { IdUser } from "#src/auth/convex/IdUser.ts"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import type { IdWorkspaceMember } from "#src/workspace/member_convex/IdWorkspaceMember.ts"
import type { WorkspaceMemberModel } from "#src/workspace/member_model/WorkspaceMemberModel.ts"
import { workspaceMemberFormField, type WorkspaceMemberFormField } from "#src/workspace/member_ui/form/workspaceMemberFormField.ts"
import { urlWorkspaceMemberList, urlWorkspaceMemberDelete } from "#src/workspace/member_url/urlWorkspaceMember.ts"
import { workspaceRole, workspaceRoleSchema, type WorkspaceRole } from "#src/workspace/workspace_model_field/workspaceRole.ts"
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

export type WorkspaceMemberFormData = {
  userId: string
  role: WorkspaceRole
}

export type WorkspaceMemberFormState = {
  userId: SignalObject<string>
  role: SignalObject<string>
}

export type WorkspaceMemberFormErrorState = {
  userId: SignalObject<string>
  role: SignalObject<string>
}

function createWorkspaceMemberFormState(): WorkspaceMemberFormState {
  return {
    userId: createSignalObject(""),
    role: createSignalObject(""),
  }
}

function createWorkspaceMemberErrorState(): WorkspaceMemberFormErrorState {
  return {
    userId: createSignalObject(""),
    role: createSignalObject(""),
  }
}

export type WorkspaceMemberFormStateManagement = {
  mode: FormMode
  isSubmitting: SignalObject<boolean>
  serverState: SignalObject<WorkspaceMemberModel>
  state: WorkspaceMemberFormState
  errors: WorkspaceMemberFormErrorState
  hasErrors: () => boolean
  fillTestData: () => void
  loadData: (data: WorkspaceMemberModel) => void
  validateOnChange: (field: WorkspaceMemberFormField) => Scheduled<[value: string]>
  handleSubmit: (e: SubmitEvent) => Promise<void>
}

function createEmptyWorkspaceMember(): WorkspaceMemberModel {
  const now = new Date()
  const iso = now.toISOString()
  return {
    memberId: "",
    workspaceHandle: "",
    userId: "",
    role: workspaceRole.member,
    invitedBy: "",
    createdAt: iso,
    updatedAt: iso,
  }
}

export type WorkspaceMemberFormAddFn = (state: WorkspaceMemberFormData) => Promise<void>
export type WorkspaceMemberFormEditFn = (state: WorkspaceMemberFormData) => Promise<void>
export type WorkspaceMemberFormRemoveFn = () => Promise<void>

type WorkspaceMemberFormActions = {
  add?: WorkspaceMemberFormAddFn
  edit?: WorkspaceMemberFormEditFn
  remove?: WorkspaceMemberFormRemoveFn
}

export function workspaceMemberFormStateManagement(
  mode: FormMode,
  workspaceHandle: string,
  memberId?: IdWorkspaceMember,
  workspaceMember?: WorkspaceMemberModel,
): WorkspaceMemberFormStateManagement {
  const actions: WorkspaceMemberFormActions = createActions(mode, workspaceHandle, memberId)
  const serverState = createSignalObject(createEmptyWorkspaceMember())
  const isSubmitting = createSignalObject(false)
  const state = createWorkspaceMemberFormState()
  if (workspaceMember) {
    loadData(workspaceMember, serverState, state)
  }
  const errors = createWorkspaceMemberErrorState()
  return {
    mode,
    isSubmitting,
    serverState,
    state,
    loadData: (data: WorkspaceMemberModel) => loadData(data, serverState, state),
    errors,
    hasErrors: () => hasErrors(errors),
    fillTestData: () => fillTestData(state, errors),
    validateOnChange: (field: WorkspaceMemberFormField) => validateOnChange(field, state, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, isSubmitting, serverState, state, errors, actions),
  }
}

function loadData(data: WorkspaceMemberModel, serverState: SignalObject<WorkspaceMemberModel>, state: WorkspaceMemberFormState): void {
  serverState.set(data)
  state.role.set(data.role)
}

function hasErrors(errors: WorkspaceMemberFormErrorState) {
  return !!errors.role.get()
}

function fillTestData(state: WorkspaceMemberFormState, errors: WorkspaceMemberFormErrorState) {
  state.role.set("member")

  for (const field of Object.values(workspaceMemberFormField)) {
    updateFieldError(field, state[field].get(), state, errors)
  }
}

function validateOnChange(field: WorkspaceMemberFormField, state: WorkspaceMemberFormState, errors: WorkspaceMemberFormErrorState) {
  return debounce((value: string) => {
    updateFieldError(field, value, state, errors)
  }, debounceMs)
}

function updateFieldError(
  field: WorkspaceMemberFormField,
  value: string,
  state: WorkspaceMemberFormState,
  errors: WorkspaceMemberFormErrorState,
) {
  const result = validateFieldResult(field, value)
  const errorSig = errors[field as keyof typeof errors]
  if (result.success) {
    errorSig.set("")
  } else {
    errorSig.set(result.issues[0].message)
  }
}

function validateFieldResult(field: WorkspaceMemberFormField, value: string) {
  if (field === workspaceMemberFormField.role) {
    return a.safeParse(workspaceRoleSchema, value)
  }
  return a.safeParse(a.string(), value)
}

//
// Actions
//

async function handleSubmit(
  e: SubmitEvent,
  isSubmitting: SignalObject<boolean>,
  serverState: SignalObject<WorkspaceMemberModel>,
  state: WorkspaceMemberFormState,
  errors: WorkspaceMemberFormErrorState,
  actions: WorkspaceMemberFormActions,
): Promise<void> {
  e.preventDefault()

  if (isSubmitting.get()) {
    const title = ttc("Submission in progress, please wait")
    console.info(title)
    return
  }

  const userId = state.userId.get()
  const role = state.role.get()

  const roleResult = validateFieldResult(workspaceMemberFormField.role, role)

  errors.role.set(roleResult.success ? "" : roleResult.issues[0].message)

  const isSuccess = roleResult.success

  if (!isSuccess) {
    if (!roleResult.success) {
      toastAdd({ title: roleResult.issues[0].message, icon: mdiAlertCircle, id: workspaceMemberFormField.role })
    }
    return
  }

  isSubmitting.set(true)

  if (actions.add) {
    const data: WorkspaceMemberFormData = { userId, role: role as WorkspaceRole }
    await actions.add(data)
  }

  if (actions.edit) {
    const data: WorkspaceMemberFormData = { userId, role: role as WorkspaceRole }
    await actions.edit(data)
  }

  if (actions.remove) {
    await actions.remove()
  }

  isSubmitting.set(false)
}

function createActions(mode: FormMode, workspaceHandle: string, memberId: IdWorkspaceMember | undefined): WorkspaceMemberFormActions {
  const actions: WorkspaceMemberFormActions = {}
  if (mode === formMode.add) {
    const addMutation = createMutation(api.workspace.workspaceMemberCreateMutation)
    actions.add = async (data) => addAction(data, workspaceHandle, addMutation)
  }
  if (mode === formMode.edit) {
    const editMutation = createMutation(api.workspace.workspaceMemberEditMutation)
    actions.edit = async (data) => editAction(data, workspaceHandle, memberId, editMutation)
  }
  if (mode === formMode.remove) {
    const deleteMutation = createMutation(api.workspace.workspaceMemberDeleteMutation)
    actions.remove = async () => removeAction(workspaceHandle, memberId, deleteMutation)
  }
  return actions
}

interface WorkspaceMemberCreateMutationProps extends HasToken {
  workspaceHandle: string
  userId: IdUser
  role: WorkspaceRole
}

interface WorkspaceMemberEditMutationProps extends HasToken {
  workspaceHandle: string
  memberId: IdWorkspaceMember
  role: WorkspaceRole
}

interface WorkspaceMemberRemoveMutationProps extends HasToken {
  workspaceHandle: string
  memberId: IdWorkspaceMember
}

async function addAction(
  data: WorkspaceMemberFormData,
  workspaceHandle: string,
  addMutation: (data: WorkspaceMemberCreateMutationProps) => Promise<Result<IdWorkspaceMember>>,
): Promise<void> {
  const memberIdResult = await addMutation({
    token: userTokenGet(),
    workspaceHandle,
    userId: data.userId as IdUser,
    role: data.role,
  })
  if (!memberIdResult.success) {
    console.error(memberIdResult)
    toastAdd({ title: memberIdResult.errorMessage, variant: toastVariant.error })
    return
  }
  const url = urlWorkspaceMemberList(workspaceHandle)
  navigateTo(url)
}

async function editAction(
  data: WorkspaceMemberFormData,
  workspaceHandle: string,
  memberId: IdWorkspaceMember | undefined,
  editMutation: (data: WorkspaceMemberEditMutationProps) => Promise<Result<null>>,
) {
  if (!memberId) {
    toastAdd({ title: "!memberId", variant: toastVariant.error })
    return
  }
  const result = await editMutation({
    token: userTokenGet(),
    workspaceHandle,
    memberId,
    role: data.role,
  })
  if (!result.success) {
    console.error(result)
    toastAdd({ title: result.errorMessage, variant: toastVariant.error })
    return
  }
  navigateTo(getReturnPath(formMode.edit, workspaceHandle, memberId))
}

async function removeAction(
  workspaceHandle: string,
  memberId: IdWorkspaceMember | undefined,
  deleteMutation: (data: WorkspaceMemberRemoveMutationProps) => Promise<Result<null>>,
) {
  if (!memberId) {
    toastAdd({ title: "!memberId", variant: toastVariant.error })
    return
  }
  const result = await deleteMutation({
    token: userTokenGet(),
    workspaceHandle,
    memberId,
  })
  if (!result.success) {
    console.error(result)
    toastAdd({ title: result.errorMessage, variant: toastVariant.error })
    return
  }
  navigateTo(getReturnPath(formMode.remove, workspaceHandle, memberId))
}

function getReturnPath(mode: FormMode, workspaceHandle: string, memberId?: IdWorkspaceMember) {
  if (mode === formMode.edit && memberId) {
    return urlWorkspaceMemberDelete(workspaceHandle, memberId)
  }
  return urlWorkspaceMemberList(workspaceHandle)
}
