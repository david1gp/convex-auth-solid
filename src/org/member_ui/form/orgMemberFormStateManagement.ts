import type { IdUser } from "@/auth/convex/IdUser"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { IdOrgMember } from "@/org/member_convex/IdOrgMember"
import type { OrgMemberModel } from "@/org/member_model/OrgMemberModel"
import { orgMemberFormField, type OrgMemberFormField } from "@/org/member_ui/form/orgMemberFormField"
import { urlOrgMemberList, urlOrgMemberView } from "@/org/member_url/urlOrgMember"
import { orgRole, orgRoleSchema, type OrgRole } from "@/org/org_model_field/orgRole"
import { createMutation } from "@/utils/convex_client/createMutation"
import { navigateTo } from "@/utils/router/navigateTo"
import { debounceMs } from "@/utils/ui/debounceMs"
import type { HasToken } from "@/utils/ui/HasToken"
import { api } from "@convex/_generated/api"
import { mdiAlertCircle } from "@mdi/js"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import * as a from "valibot"
import { formMode, type FormMode } from "~ui/input/form/formMode"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"
import type { Result } from "~utils/result/Result"

export type OrgMemberFormData = {
  userId: string
  role: OrgRole
}

export type OrgMemberFormState = {
  userId: SignalObject<string>
  role: SignalObject<string>
}

export type OrgMemberFormErrorState = {
  userId: SignalObject<string>
  role: SignalObject<string>
}

function createOrgMemberFormState(): OrgMemberFormState {
  return {
    userId: createSignalObject(""),
    role: createSignalObject(""),
  }
}

function createOrgMemberErrorState(): OrgMemberFormErrorState {
  return {
    userId: createSignalObject(""),
    role: createSignalObject(""),
  }
}

export type OrgMemberFormStateManagement = {
  mode: FormMode
  isSaving: SignalObject<boolean>
  serverState: SignalObject<OrgMemberModel>
  state: OrgMemberFormState
  errors: OrgMemberFormErrorState
  hasErrors: () => boolean
  fillTestData: () => void
  loadData: (data: OrgMemberModel) => void
  validateOnChange: (field: OrgMemberFormField) => Scheduled<[value: string]>
  handleSubmit: (e: SubmitEvent) => Promise<void>
}

function createEmptyOrgMember(): OrgMemberModel {
  const now = new Date()
  const iso = now.toISOString()
  return {
    memberId: "",
    orgHandle: "",
    userId: "",
    role: orgRole.member,
    invitedBy: "",
    createdAt: iso,
    updatedAt: iso,
  }
}

export type OrgMemberFormAddFn = (state: OrgMemberFormData) => Promise<void>
export type OrgMemberFormEditFn = (state: OrgMemberFormData) => Promise<void>
export type OrgMemberFormRemoveFn = () => Promise<void>

type OrgMemberFormActions = {
  add?: OrgMemberFormAddFn
  edit?: OrgMemberFormEditFn
  remove?: OrgMemberFormRemoveFn
}

export function orgMemberFormStateManagement(
  mode: FormMode,
  orgHandle: string,
  memberId?: IdOrgMember,
  orgMember?: OrgMemberModel,
): OrgMemberFormStateManagement {
  const actions: OrgMemberFormActions = createActions(mode, orgHandle, memberId)
  const serverState = createSignalObject(createEmptyOrgMember())
  const isSaving = createSignalObject(false)
  const state = createOrgMemberFormState()
  if (orgMember) {
    loadData(orgMember, serverState, state)
  }
  const errors = createOrgMemberErrorState()
  return {
    mode,
    isSaving,
    serverState,
    state,
    loadData: (data: OrgMemberModel) => loadData(data, serverState, state),
    errors,
    hasErrors: () => hasErrors(errors),
    fillTestData: () => fillTestData(state, errors),
    validateOnChange: (field: OrgMemberFormField) => validateOnChange(field, state, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, isSaving, serverState, state, errors, actions),
  }
}

function loadData(data: OrgMemberModel, serverState: SignalObject<OrgMemberModel>, state: OrgMemberFormState): void {
  serverState.set(data)
  state.role.set(data.role)
}

function hasErrors(errors: OrgMemberFormErrorState) {
  return !!errors.role.get()
}

function fillTestData(state: OrgMemberFormState, errors: OrgMemberFormErrorState) {
  state.role.set("member")

  for (const field of Object.values(orgMemberFormField)) {
    updateFieldError(field, state[field].get(), state, errors)
  }
}

function validateOnChange(field: OrgMemberFormField, state: OrgMemberFormState, errors: OrgMemberFormErrorState) {
  return debounce((value: string) => {
    updateFieldError(field, value, state, errors)
  }, debounceMs)
}

function updateFieldError(
  field: OrgMemberFormField,
  value: string,
  state: OrgMemberFormState,
  errors: OrgMemberFormErrorState,
) {
  const result = validateFieldResult(field, value)
  const errorSig = errors[field as keyof typeof errors]
  if (result.success) {
    errorSig.set("")
  } else {
    errorSig.set(result.issues[0].message)
  }
}

function validateFieldResult(field: OrgMemberFormField, value: string) {
  if (field === orgMemberFormField.role) {
    return a.safeParse(orgRoleSchema, value)
  }
  return a.safeParse(a.string(), value)
}

//
// Actions
//

async function handleSubmit(
  e: SubmitEvent,
  isSaving: SignalObject<boolean>,
  serverState: SignalObject<OrgMemberModel>,
  state: OrgMemberFormState,
  errors: OrgMemberFormErrorState,
  actions: OrgMemberFormActions,
): Promise<void> {
  e.preventDefault()

  const userId = state.userId.get()
  const role = state.role.get()

  const roleResult = validateFieldResult(orgMemberFormField.role, role)

  errors.role.set(roleResult.success ? "" : roleResult.issues[0].message)

  const isSuccess = roleResult.success

  if (!isSuccess) {
    if (!roleResult.success) {
      toastAdd({ title: roleResult.issues[0].message, icon: mdiAlertCircle, id: orgMemberFormField.role })
    }
    return
  }

  isSaving.set(true)

  if (actions.add) {
    const data: OrgMemberFormData = { userId, role: role as OrgRole }
    await actions.add(data)
  }

  if (actions.edit) {
    const data: OrgMemberFormData = { userId, role: role as OrgRole }
    await actions.edit(data)
  }

  if (actions.remove) {
    await actions.remove()
  }

  isSaving.set(false)
}

function createActions(mode: FormMode, orgHandle: string, memberId: IdOrgMember | undefined): OrgMemberFormActions {
  const actions: OrgMemberFormActions = {}
  if (mode === formMode.add) {
    const addMutation = createMutation(api.org.orgMemberCreateMutation)
    actions.add = async (data) => addAction(data, orgHandle, addMutation)
  }
  if (mode === formMode.edit) {
    const editMutation = createMutation(api.org.orgMemberEditMutation)
    actions.edit = async (data) => editAction(data, orgHandle, memberId, editMutation)
  }
  if (mode === formMode.remove) {
    const deleteMutation = createMutation(api.org.orgMemberDeleteMutation)
    actions.remove = async () => removeAction(orgHandle, memberId, deleteMutation)
  }
  return actions
}

interface OrgMemberCreateMutationProps extends HasToken {
  orgHandle: string
  userId: IdUser
  role: OrgRole
}

interface OrgMemberEditMutationProps extends HasToken {
  orgHandle: string
  memberId: IdOrgMember
  role: OrgRole
}

interface OrgMemberRemoveMutationProps extends HasToken {
  orgHandle: string
  memberId: IdOrgMember
}

async function addAction(
  data: OrgMemberFormData,
  orgHandle: string,
  addMutation: (data: OrgMemberCreateMutationProps) => Promise<Result<IdOrgMember>>,
): Promise<void> {
  const memberIdResult = await addMutation({
    token: userTokenGet(),
    orgHandle,
    userId: data.userId as IdUser,
    role: data.role,
  })
  if (!memberIdResult.success) {
    console.error(memberIdResult)
    toastAdd({ title: memberIdResult.errorMessage, variant: toastVariant.error })
    return
  }
  const url = urlOrgMemberView(orgHandle, memberIdResult.data)
  navigateTo(url)
}

async function editAction(
  data: OrgMemberFormData,
  orgHandle: string,
  memberId: IdOrgMember | undefined,
  editMutation: (data: OrgMemberEditMutationProps) => Promise<Result<null>>,
) {
  if (!memberId) {
    toastAdd({ title: "!memberId", variant: toastVariant.error })
    return
  }
  const result = await editMutation({
    token: userTokenGet(),
    orgHandle,
    memberId,
    role: data.role,
  })
  if (!result.success) {
    console.error(result)
    toastAdd({ title: result.errorMessage, variant: toastVariant.error })
    return
  }
  navigateTo(getReturnPath(formMode.edit, orgHandle, memberId))
}

async function removeAction(
  orgHandle: string,
  memberId: IdOrgMember | undefined,
  deleteMutation: (data: OrgMemberRemoveMutationProps) => Promise<Result<null>>,
) {
  if (!memberId) {
    toastAdd({ title: "!memberId", variant: toastVariant.error })
    return
  }
  const result = await deleteMutation({
    token: userTokenGet(),
    orgHandle,
    memberId,
  })
  if (!result.success) {
    console.error(result)
    toastAdd({ title: result.errorMessage, variant: toastVariant.error })
    return
  }
  navigateTo(getReturnPath(formMode.remove, orgHandle, memberId))
}

function getReturnPath(mode: FormMode, orgHandle: string, memberId?: IdOrgMember) {
  if (mode === formMode.edit && memberId) {
    return urlOrgMemberView(orgHandle, memberId)
  }
  return urlOrgMemberList(orgHandle)
}
