import { emailSchema } from "@/auth/model/emailSchema"
import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import { orgInvitationFormField, type OrgInvitationFormField } from "@/org/invitation_ui/form/orgInvitationFormField"
import { orgRoleSchema, type OrgRole } from "@/org/org_model/orgRole"
import { debounceMs } from "@/utils/ui/debounceMs"
import { mdiAlertCircle } from "@mdi/js"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import * as v from "valibot"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"

export type OrgInvitationFormData = {
  invitedEmail: string
  role: OrgRole
  invitationCode: string
}

export type OrgInvitationFormState = {
  invitedEmail: SignalObject<string>
  role: SignalObject<string>
}

export type OrgInvitationFormErrorState = {
  invitedEmail: SignalObject<string>
  role: SignalObject<string>
}

function createOrgInvitationFormState(): OrgInvitationFormState {
  return {
    invitedEmail: createSignalObject(""),
    role: createSignalObject(""),
  }
}

function createOrgInvitationErrorState(): OrgInvitationFormErrorState {
  return {
    invitedEmail: createSignalObject(""),
    role: createSignalObject(""),
  }
}

export type OrgInvitationFormStateManagement = {
  isSaving: SignalObject<boolean>
  serverState: SignalObject<DocOrgInvitation>
  state: OrgInvitationFormState
  errors: OrgInvitationFormErrorState
  hasErrors: () => boolean
  fillTestData: () => void
  loadData: (data: DocOrgInvitation) => void
  validateOnChange: (field: OrgInvitationFormField) => Scheduled<[value: string]>
  handleSubmit: (e: SubmitEvent) => Promise<void>
}

function createEmptyDocOrgInvitation(): DocOrgInvitation {
  const now = new Date()
  const iso = now.toISOString()
  return {
    _id: "" as any,
    orgId: "" as any,
    invitedEmail: "",
    invitationCode: "",
    role: "member",
    invitedBy: "" as any,
    emailSendAt: iso,
    emailSendAmount: 0,
    acceptedAt: undefined,
    createdAt: iso,
    updatedAt: iso,
    _creationTime: now.getMilliseconds(),
  }
}

export type OrgInvitationFormAddFn = (state: OrgInvitationFormData) => Promise<void>
export type OrgInvitationFormEditFn = (state: OrgInvitationFormData) => Promise<void>
export type OrgInvitationFormRemoveFn = () => Promise<void>

export type OrgInvitationFormActions = {
  add?: OrgInvitationFormAddFn
  edit?: OrgInvitationFormEditFn
  remove?: OrgInvitationFormRemoveFn
}

export function orgInvitationFormStateManagement(actions: OrgInvitationFormActions): OrgInvitationFormStateManagement {
  const serverState = createSignalObject(createEmptyDocOrgInvitation())
  const isSaving = createSignalObject(false)
  const state = createOrgInvitationFormState()
  const errors = createOrgInvitationErrorState()
  return {
    isSaving,
    serverState,
    state,
    loadData: (data: DocOrgInvitation) => loadData(data, serverState, state),
    errors,
    hasErrors: () => hasErrors(errors),
    fillTestData: () => fillTestData(state, errors),
    validateOnChange: (field: OrgInvitationFormField) => validateOnChange(field, state, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, isSaving, serverState, state, errors, actions),
  }
}

function loadData(
  data: DocOrgInvitation,
  serverState: SignalObject<DocOrgInvitation>,
  state: OrgInvitationFormState,
): void {
  serverState.set(data)
  state.invitedEmail.set(data.invitedEmail)
  state.role.set(data.role)
}

function hasErrors(errors: OrgInvitationFormErrorState) {
  return !!errors.invitedEmail.get() || !!errors.role.get()
}

function fillTestData(state: OrgInvitationFormState, errors: OrgInvitationFormErrorState) {
  state.invitedEmail.set("test@example.com")
  state.role.set("member")

  for (const field of Object.values(orgInvitationFormField)) {
    updateFieldError(field, state[field].get(), state, errors)
  }
}

function validateOnChange(
  field: OrgInvitationFormField,
  state: OrgInvitationFormState,
  errors: OrgInvitationFormErrorState,
) {
  return debounce((value: string) => {
    updateFieldError(field, value, state, errors)
  }, debounceMs)
}

function updateFieldError(field: OrgInvitationFormField, value: string, state: OrgInvitationFormState, errors: OrgInvitationFormErrorState) {
  const result = validateFieldResult(field, value)
  const errorSig = errors[field as keyof typeof errors]
  if (result.success) {
    errorSig.set("")
  } else {
    errorSig.set(result.issues[0].message)
  }
}

function validateFieldResult(field: OrgInvitationFormField, value: string) {
  if (field === orgInvitationFormField.invitedEmail) {
    return v.safeParse(emailSchema, value)
  }
  if (field === orgInvitationFormField.role) {
    return v.safeParse(orgRoleSchema, value)
  }
  return v.safeParse(v.string(), value)
}

async function handleSubmit(
  e: SubmitEvent,
  isSaving: SignalObject<boolean>,
  serverState: SignalObject<DocOrgInvitation>,
  state: OrgInvitationFormState,
  errors: OrgInvitationFormErrorState,
  actions: OrgInvitationFormActions,
): Promise<void> {
  e.preventDefault()

  const invitedEmail = state.invitedEmail.get()
  const role = state.role.get()
  const invitationCode = serverState.get().invitationCode || "temp-code"

  const invitedEmailResult = validateFieldResult(orgInvitationFormField.invitedEmail, invitedEmail)
  const roleResult = validateFieldResult(orgInvitationFormField.role, role)

  errors.invitedEmail.set(invitedEmailResult.success ? "" : invitedEmailResult.issues[0].message)
  errors.role.set(roleResult.success ? "" : roleResult.issues[0].message)

  const isSuccess = invitedEmailResult.success && roleResult.success

  if (!isSuccess) {
    if (!invitedEmailResult.success) {
      toastAdd({
        title: invitedEmailResult.issues[0].message,
        icon: mdiAlertCircle,
        id: orgInvitationFormField.invitedEmail,
      })
    }
    if (!roleResult.success) {
      toastAdd({ title: roleResult.issues[0].message, icon: mdiAlertCircle, id: orgInvitationFormField.role })
    }
    return
  }

  isSaving.set(true)

  if (actions.add) {
    const data: OrgInvitationFormData = { invitedEmail, role: role as OrgRole, invitationCode }
    await actions.add(data)
  }

  if (actions.edit) {
    const data: OrgInvitationFormData = { invitedEmail, role: role as OrgRole, invitationCode }
    await actions.edit(data)
  }

  if (actions.remove) {
    await actions.remove()
  }

  isSaving.set(false)
}
