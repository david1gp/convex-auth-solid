import { createResult, createResultError, type Result } from "#result"
import { orgModelCreateEmpty, type OrgDataModel, type OrgModel } from "#src/org/org_model/OrgModel.js"
import { orgDataPartialSchema } from "#src/org/org_model/orgSchema.js"
import type { OrgFormState } from "#src/org/org_ui/form/orgFormStateManagement.js"
import { pageRouteOrg } from "#src/org/org_url/pageRouteOrg.js"
import { cachePrefix } from "#src/utils/ui/cachePrefix.js"
import { debounceSaveMs } from "#src/utils/ui/debounceMs.js"
import { formMode, type FormMode } from "#ui/input/form/formMode.js"
import { debounce } from "@solid-primitives/scheduled"
import * as a from "valibot"

const orgFormLocalStorageKey = cachePrefix + pageRouteOrg.orgAdd

type OrgFormDataLoadFn = (data: OrgModel) => void

export type OrgFormLocalStorage = {
  createDebounceSave(mode: FormMode, state: OrgFormState): () => void
  loadData(loadFormData: OrgFormDataLoadFn): void
  clearLocalStorage(): void
}

export const orgFormLocalStorage: OrgFormLocalStorage = {
  createDebounceSave,
  loadData,
  clearLocalStorage,
}

function loadData(loadFormData: OrgFormDataLoadFn): void {
  const loadedData = loadFromLocalStorage()
  if (!loadedData.success) return
  const empty = orgModelCreateEmpty()
  const combined = { ...empty, ...loadedData.data }
  loadFormData(combined)
}

function createDebounceSave(mode: FormMode, state: OrgFormState) {
  if (mode !== formMode.add) return () => {}
  return debounce(() => {
    const orgModel = stateToPartialOrgModel(state)
    saveToLocalStorage(orgModel)
  }, debounceSaveMs)
}

function stateToPartialOrgModel(state: OrgFormState): Partial<OrgDataModel> {
  const result: Partial<OrgDataModel> = {}

  // Only add fields that have values (not empty strings)
  const orgHandle = state.orgHandle.get()
  if (orgHandle) result.orgHandle = orgHandle

  const name = state.name.get()
  if (name) result.name = name

  const description = state.description.get()
  if (description) result.description = description

  const url = state.url.get()
  if (url) result.url = url

  const image = state.image.get()
  if (image) result.image = image

  return result
}

function loadFromLocalStorage(): Result<Partial<OrgDataModel>> {
  const key = orgFormLocalStorageKey
  console.log("loadOrgFromLocalStorage", key)
  const readValue = localStorage.getItem(key)
  if (!readValue) return createResultError("loadOrgFromLocalStorage", `no ${key} saved in localStorage`)
  const parsingSchema = a.pipe(a.string(), a.parseJson(), orgDataPartialSchema)
  const parsing = a.safeParse(parsingSchema, readValue)
  if (!parsing.success) {
    return createResultError("loadOrgFromLocalStorage", a.summarize(parsing.issues), readValue)
  }
  return createResult(parsing.output)
}

function saveToLocalStorage(value: Partial<OrgModel>) {
  const key = orgFormLocalStorageKey
  const serialized = JSON.stringify(value, null, 2)
  localStorage.setItem(key, serialized)
}

function clearLocalStorage() {
  localStorage.removeItem(orgFormLocalStorageKey)
}
