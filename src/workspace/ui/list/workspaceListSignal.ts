import { cachePrefix } from "@/utils/ui/cachePrefix"
import type { IdWorkspace } from "@/workspace/convex/IdWorkspace"
import type { WorkspaceModel } from "@/workspace/model/WorkspaceModel"
import { workspaceSchema } from "@/workspace/model/workspaceSchema"
import * as v from "valibot"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"
import { createResult, createResultError, type Result } from "~utils/result/Result"

const workspaceListLocalStorageKey = cachePrefix + "workspaceList"

export const workspaceListSignal: SignalObject<WorkspaceModel[]> = createWorkspaceListSignal()

export function workspaceListSignalAdd(newWorkspace: WorkspaceModel): WorkspaceModel[] {
  const workspaceList = workspaceListSignal.get()
  const newWorkspaces = workspaceListAddOrReplace(workspaceList, newWorkspace)
  workspaceListSignal.set(newWorkspaces)
  return newWorkspaces
}

function workspaceListAddOrReplace(workspaces: WorkspaceModel[], newWorkspace: WorkspaceModel): WorkspaceModel[] {
  const existingWorkspaceIndex = workspaces.findIndex((workspace) => workspace._id === newWorkspace._id)
  const newWorkspaces = [...workspaces]

  if (existingWorkspaceIndex !== -1) {
    // Update existing workspace
    newWorkspaces[existingWorkspaceIndex] = newWorkspace
  } else {
    // Add new workspace
    newWorkspaces.push(newWorkspace)
  }
  return newWorkspaces
}

function createWorkspaceListSignal(): SignalObject<WorkspaceModel[]> {
  let hasLoaded = false
  const signal = createSignalObject<WorkspaceModel[]>([])

  // Load from localStorage if not already loaded
  if (!hasLoaded) {
    const result = workspaceListLoadFromLocalStorage()
    if (result.success) {
      signal.set(result.data)
    }
    hasLoaded = true
  }

  // Override the set method to also save to localStorage
  const originalSet = signal.set
  signal.set = (value) => {
    const result = originalSet(value)
    workspaceListSaveToLocalStorage(value)
    return result
  }

  // Listen to localStorage events to update workspace list
  function handleStorageEvent(event: StorageEvent) {
    if (event.key === workspaceListLocalStorageKey && event.newValue !== null) {
      const parsingResult = workspaceListLoadFromLocalStorage(event.newValue)
      if (!parsingResult.success) return
      signal.set(parsingResult.data)
    }
  }

  // Add event listener
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageEvent)
  }

  return signal
}

export function workspaceListLoadFromLocalStorage(
  read = localStorage.getItem(workspaceListLocalStorageKey),
): Result<WorkspaceModel[]> {
  const op = "workspaceListLoadFromLocalStorage"
  // const read = localStorage.getItem(workspaceListLocalStorageKey)
  if (!read) return createResultError(op, "no workspaceList saved in localStorage")
  const workspaceListSchema = v.array(workspaceSchema)
  const schema = v.pipe(v.string(), v.parseJson(), workspaceListSchema)
  const parsing = v.safeParse(schema, read)
  if (!parsing.success) {
    return createResultError(op, v.summarize(parsing.issues), read)
  }
  return createResult(parsing.output as WorkspaceModel[])
}

export function workspaceListSaveToLocalStorage(workspaces: WorkspaceModel[]) {
  const op = "workspaceListSaveToLocalStorage"
  const serialized = JSON.stringify(workspaces, null, 2)
  localStorage.setItem(workspaceListLocalStorageKey, serialized)
}

export function workspaceListFindByHandle(workspaceHandle: string): WorkspaceModel | undefined {
  const workspaceList = workspaceListSignal.get()
  return workspaceList.find((w) => w.workspaceHandle === workspaceHandle)
}
export function workspaceListFindNameByHandle(handle: string): string | undefined {
  if (!handle) return undefined
  const ws = workspaceListFindByHandle(handle)
  if (!ws) return undefined
  return ws.name
}

export function workspaceListFindById(id: IdWorkspace): WorkspaceModel | undefined {
  const workspaceList = workspaceListSignal.get()
  return workspaceList.find((w) => w._id === id)
}
