import type { DocOrgMember } from "@/org/member_convex/IdOrgMember"
import { orgMemberFormField, type OrgMemberFormField } from "@/org/member_ui/form/orgMemberFormField"
import { orgRoleSchema, type OrgRole } from "@/org/org_model/orgRole"
import { debounceMs } from "@/utils/ui/debounceMs"
import { mdiAlertCircle } from "@mdi/js"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import * as v from "valibot"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"

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
  isSaving: SignalObject<boolean>
  serverState: SignalObject<DocOrgMember>
  state: OrgMemberFormState
  errors: OrgMemberFormErrorState
  hasErrors: () => boolean
  loadData: (data: DocOrgMember) => void
  validateOnChange: (field: OrgMemberFormField) => Scheduled<[value: string]>
  handleSubmit: (e: SubmitEvent) => Promise<void>
}

function createEmptyDocOrgMember(): DocOrgMember {
  const now = new Date()
  const iso = now.toISOString()
  return {
    _id: "" as any,
    orgId: "" as any,
    userId: "" as any,
    role: "member",
    invitedBy: "" as any,
    createdAt: iso,
    updatedAt: iso,
    _creationTime: now.getMilliseconds(),
  }
}

export type OrgMemberFormAddFn = (state: OrgMemberFormData) => Promise<void>
export type OrgMemberFormEditFn = (state: OrgMemberFormData) => Promise<void>
export type OrgMemberFormRemoveFn = () => Promise<void>

export type OrgMemberFormActions = {
  add?: OrgMemberFormAddFn
  edit?: OrgMemberFormEditFn
  remove?: OrgMemberFormEditFn
}

export function orgMemberEditFormStateManagement(actions: OrgMemberFormActions): OrgMemberFormStateManagement {
  const serverState = createSignalObject(createEmptyDocOrgMember())
  const isSaving = createSignalObject(false)
  const state = createOrgMemberFormState()
  const errors = createOrgMemberErrorState()
  return {
    isSaving,
    serverState,
    state,
    loadData: (data: DocOrgMember) => loadData(data, serverState, state),
    errors,
    hasErrors: () => hasErrors(errors),
    validateOnChange: (field: OrgMemberFormField) => validateOnChange(field, state, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, isSaving, serverState, state, errors, actions),
  }
}

function loadData(data: DocOrgMember, serverState: SignalObject<DocOrgMember>, state: OrgMemberFormState): void {
  serverState.set(data)
  state.role.set(data.role)
}

function hasErrors(errors: OrgMemberFormErrorState) {
  return !!errors.role.get()
}

function validateOnChange(field: OrgMemberFormField, state: OrgMemberFormState, errors: OrgMemberFormErrorState) {
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

function validateField(field: OrgMemberFormField, value: string) {
  if (field === orgMemberFormField.role) {
    return v.safeParse(orgRoleSchema, value)
  }
  return v.safeParse(v.string(), value)
}

async function handleSubmit(
  e: SubmitEvent,
  isSaving: SignalObject<boolean>,
  serverState: SignalObject<DocOrgMember>,
  state: OrgMemberFormState,
  errors: OrgMemberFormErrorState,
  actions: OrgMemberFormActions,
): Promise<void> {
  e.preventDefault()

  const userId = state.userId.get()
  const role = state.role.get()

  const roleResult = validateField(orgMemberFormField.role, role)

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

  isSaving.set(false)
}
