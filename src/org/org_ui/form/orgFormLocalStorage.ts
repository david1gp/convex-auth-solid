import { orgModelCreateEmpty, type OrgDataModel, type OrgModel } from "@/org/org_model/OrgModel"
import { orgDataPartialSchema } from "@/org/org_model/orgSchema"
import { pageRouteOrg } from "@/org/org_url/pageRouteOrg"
import { cachePrefix } from "@/utils/ui/cachePrefix"
import { debounceSaveMs } from "@/utils/ui/debounceMs"
import { debounce } from "@solid-primitives/scheduled"
import * as a from "valibot"
import { formMode, type FormMode } from "~ui/input/form/formMode"
import { createResult, createResultError, type Result } from "~utils/result/Result"
import type { OrgFormState } from "@/org/org_ui/form/orgFormStateManagement"

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
