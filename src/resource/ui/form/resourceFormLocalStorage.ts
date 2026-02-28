import type { ResourceFilesModel } from "@/resource/model/ResourceFilesModel"
import { resourceFilesSchema } from "@/resource/model/ResourceFilesModel"
import { pageRouteResource } from "@/resource/url/pageRouteResource"
import { cachePrefix } from "@/utils/ui/cachePrefix"
import { debounceSaveMs } from "@/utils/ui/debounceMs"
import { debounce } from "@solid-primitives/scheduled"
import * as a from "valibot"
import { formMode, type FormMode } from "~ui/input/form/formMode"
import { createResult, createResultError, type Result } from "~utils/result/Result"
import type { ResourceFormState } from "@/resource/ui/form/ResourceFormState"

const resourceFormLocalStorageKey = cachePrefix + pageRouteResource.resourceAdd

export type ResourceFormLocalStorage = {
  storageKey: string
  createDebounceSave(mode: FormMode, state: ResourceFormState): () => void
  loadFromLocalStorage(): Result<ResourceFilesModel>
  saveToLocalStorage(value: ResourceFilesModel): void
  clearLocalStorage(): void
}

export const resourceFormLocalStorage: ResourceFormLocalStorage = {
  storageKey: resourceFormLocalStorageKey,
  createDebounceSave,
  loadFromLocalStorage,
  saveToLocalStorage,
  clearLocalStorage,
}

function createDebounceSave(mode: FormMode, state: ResourceFormState) {
  if (mode !== formMode.add) return () => {}
  return debounce(() => {
    const resourceFilesModel = stateToResourceFilesModel(state)
    saveToLocalStorage(resourceFilesModel)
  }, debounceSaveMs)
}

function stateToResourceFilesModel(state: ResourceFormState): ResourceFilesModel {
  const now = new Date().toISOString()
  return {
    resource: {
      resourceId: state.resourceId.get(),
      name: state.name.get(),
      description: state.description.get(),
      type: state.type.get(),
      visibility: state.visibility.get(),
      image: state.image.get(),
      language: state.language.get(),
      createdAt: now,
      updatedAt: now,
    },
    files: state.fileIds.get(),
  }
}

function loadFromLocalStorage(): Result<ResourceFilesModel> {
  const key = resourceFormLocalStorageKey
  console.log("loadResourceFromLocalStorage", key)
  const readValue = localStorage.getItem(key)
  if (!readValue) return createResultError("loadResourceFromLocalStorage", `no ${key} saved in localStorage`)
  const parsingSchema = a.pipe(a.string(), a.parseJson(), resourceFilesSchema)
  const parsing = a.safeParse(parsingSchema, readValue)
  if (!parsing.success) {
    return createResultError("loadResourceFromLocalStorage", a.summarize(parsing.issues), readValue)
  }
  return createResult(parsing.output)
}

function saveToLocalStorage(value: ResourceFilesModel) {
  const key = resourceFormLocalStorageKey
  const serialized = JSON.stringify(value, null, 2)
  localStorage.setItem(key, serialized)
}

function clearLocalStorage() {
  localStorage.removeItem(resourceFormLocalStorageKey)
}
