import { createResult, createResultError, type Result } from "#result"
import type { WorkspaceInvitationFormState } from "#src/workspace/invitation_ui/form/workspaceInvitationFormStateManagement.ts"
import { pageRouteWorkspaceInvitation } from "#src/workspace/invitation_url/pageRouteWorkspaceInvitation.ts"
import { workspaceRoleSchema } from "#src/workspace/workspace_model_field/workspaceRole.ts"
import { cachePrefix } from "#src/utils/ui/cachePrefix.ts"
import { debounceSaveMs } from "#src/utils/ui/debounceMs.ts"
import { stringSchema0to100 } from "#src/utils/valibot/stringSchema.ts"
import { formMode, type FormMode } from "#ui/input/form/formMode.ts"
import { debounce } from "@solid-primitives/scheduled"
import * as a from "valibot"

const workspaceInvitationFormLocalStorageKey = cachePrefix + pageRouteWorkspaceInvitation.workspaceInvitationAdd

type WorkspaceInvitationFormDataLoadFn = (data: Partial<WorkspaceInvitationFormData>) => void

export type WorkspaceInvitationFormData = {
  invitedEmail: string
  role: string
}

export type WorkspaceInvitationFormLocalStorage = {
  createDebounceSave(mode: FormMode, state: WorkspaceInvitationFormState): () => void
  loadData(loadFormData: WorkspaceInvitationFormDataLoadFn): void
  clearLocalStorage(): void
}

export const workspaceInvitationFormLocalStorage: WorkspaceInvitationFormLocalStorage = {
  createDebounceSave,
  loadData,
  clearLocalStorage,
}

function loadData(loadFormData: WorkspaceInvitationFormDataLoadFn): void {
  const loadedData = loadFromLocalStorage()
  if (!loadedData.success) return
  loadFormData(loadedData.data)
}

function createDebounceSave(mode: FormMode, state: WorkspaceInvitationFormState) {
  if (mode !== formMode.add) return () => {}
  return debounce(() => {
    const formData = stateToFormData(state)
    saveToLocalStorage(formData)
  }, debounceSaveMs)
}

function stateToFormData(state: WorkspaceInvitationFormState): Partial<WorkspaceInvitationFormData> {
  const result: Partial<WorkspaceInvitationFormData> = {}

  const invitedEmail = state.invitedEmail.get()
  if (invitedEmail) result.invitedEmail = invitedEmail

  const role = state.role.get()
  if (role) result.role = role

  return result
}

function loadFromLocalStorage(): Result<Partial<WorkspaceInvitationFormData>> {
  const key = workspaceInvitationFormLocalStorageKey
  console.log("loadWorkspaceInvitationFromLocalStorage", key)
  const readValue = localStorage.getItem(key)
  if (!readValue) return createResultError("loadWorkspaceInvitationFromLocalStorage", `no ${key} saved in localStorage`)

  const partialSchema = a.partial(
    a.object({
      invitedEmail: stringSchema0to100,
      role: workspaceRoleSchema,
    }),
  )
  const parsingSchema = a.pipe(a.string(), a.parseJson(), partialSchema)
  const parsing = a.safeParse(parsingSchema, readValue)
  if (!parsing.success) {
    return createResultError("loadWorkspaceInvitationFromLocalStorage", a.summarize(parsing.issues), readValue)
  }
  return createResult(parsing.output as Partial<WorkspaceInvitationFormData>)
}

function saveToLocalStorage(value: Partial<WorkspaceInvitationFormData>) {
  const key = workspaceInvitationFormLocalStorageKey
  const serialized = JSON.stringify(value, null, 2)
  localStorage.setItem(key, serialized)
}

function clearLocalStorage() {
  localStorage.removeItem(workspaceInvitationFormLocalStorageKey)
}
