import { languageSchema } from "@/app/i18n/language"
import { pageRouteOrgInvitation } from "@/org/invitation_url/pageRouteOrgInvitation"
import { orgRoleSchema } from "@/org/org_model_field/orgRole"
import { cachePrefix } from "@/utils/ui/cachePrefix"
import { debounceSaveMs } from "@/utils/ui/debounceMs"
import { stringSchema0to100 } from "@/utils/valibot/stringSchema"
import { debounce } from "@solid-primitives/scheduled"
import * as a from "valibot"
import { formMode, type FormMode } from "~ui/input/form/formMode"
import { createResult, createResultError, type Result } from "~utils/result/Result"
import type { OrgInvitationFormState } from "@/org/invitation_ui/form/orgInvitationFormStateManagement"

const orgInvitationFormLocalStorageKey = cachePrefix + pageRouteOrgInvitation.orgInvitationAdd

type OrgInvitationFormDataLoadFn = (data: Partial<OrgInvitationFormData>) => void

export type OrgInvitationFormData = {
  invitedName: string
  invitedEmail: string
  role: string
  l: string
}

export type OrgInvitationFormLocalStorage = {
  createDebounceSave(mode: FormMode, state: OrgInvitationFormState): () => void
  loadData(loadFormData: OrgInvitationFormDataLoadFn): void
  clearLocalStorage(): void
}

export const orgInvitationFormLocalStorage: OrgInvitationFormLocalStorage = {
  createDebounceSave,
  loadData,
  clearLocalStorage,
}

function loadData(loadFormData: OrgInvitationFormDataLoadFn): void {
  const loadedData = loadFromLocalStorage()
  if (!loadedData.success) return
  loadFormData(loadedData.data)
}

function createDebounceSave(mode: FormMode, state: OrgInvitationFormState) {
  if (mode !== formMode.add) return () => {}
  return debounce(() => {
    const formData = stateToFormData(state)
    saveToLocalStorage(formData)
  }, debounceSaveMs)
}

function stateToFormData(state: OrgInvitationFormState): Partial<OrgInvitationFormData> {
  const result: Partial<OrgInvitationFormData> = {}

  // Only add fields that have values (not empty strings)
  const invitedName = state.invitedName.get()
  if (invitedName) result.invitedName = invitedName

  const invitedEmail = state.invitedEmail.get()
  if (invitedEmail) result.invitedEmail = invitedEmail

  const role = state.role.get()
  if (role) result.role = role

  const l = state.l.get()
  if (l) result.l = l

  return result
}

function loadFromLocalStorage(): Result<Partial<OrgInvitationFormData>> {
  const key = orgInvitationFormLocalStorageKey
  console.log("loadOrgInvitationFromLocalStorage", key)
  const readValue = localStorage.getItem(key)
  if (!readValue) return createResultError("loadOrgInvitationFromLocalStorage", `no ${key} saved in localStorage`)

  const partialSchema = a.partial(
    a.object({
      invitedName: stringSchema0to100,
      invitedEmail: stringSchema0to100,
      l: languageSchema,
      role: orgRoleSchema,
    }),
  )
  const parsingSchema = a.pipe(a.string(), a.parseJson(), partialSchema)
  const parsing = a.safeParse(parsingSchema, readValue)
  if (!parsing.success) {
    return createResultError("loadOrgInvitationFromLocalStorage", a.summarize(parsing.issues), readValue)
  }
  return createResult(parsing.output as Partial<OrgInvitationFormData>)
}

function saveToLocalStorage(value: Partial<OrgInvitationFormData>) {
  const key = orgInvitationFormLocalStorageKey
  const serialized = JSON.stringify(value, null, 2)
  localStorage.setItem(key, serialized)
}

function clearLocalStorage() {
  localStorage.removeItem(orgInvitationFormLocalStorageKey)
}
