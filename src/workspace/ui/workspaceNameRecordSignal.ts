import { cachePrefix } from "@/utils/ui/cachePrefix"
import type { WorkspaceModel } from "@/workspace/model/WorkspaceModel"
import * as a from "valibot"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"
import { createResult, createResultError, type Result } from "~utils/result/Result"

let hasLoaded = false

const workspaceNameLocalStorageKey = cachePrefix + "workspaceNameRecord"
const workspaceNameByIdLocalStorageKey = cachePrefix + "workspaceNameByIdRecord"

// Valibot schema for Record<string, string>
const workspaceNameRecordSchema = a.record(a.string(), a.string())
const workspaceNameByIdRecordSchema = a.record(a.string(), a.string())

export const workspaceNameRecordSignal: SignalObject<Record<string, string>> = createWorkspaceNameRecordSignal()

export function workspaceNameSet(workspaceHandle: string, workspaceName: string): Record<string, string> {
  const currentRecord = workspaceNameRecordSignal.get()
  const oldValue = currentRecord[workspaceHandle]

  // Only save if the value has actually changed
  if (oldValue === workspaceName) {
    return currentRecord
  }

  const newRecord = { ...currentRecord, [workspaceHandle]: workspaceName }
  workspaceNameRecordSignal.set(newRecord)
  return newRecord
}

export function workspaceNameGet(workspaceHandle: string): string | undefined {
  const record = workspaceNameRecordSignal.get()
  return record[workspaceHandle]
}

export function workspaceNameAddList(workspaces: WorkspaceModel[]): Record<string, string> {
  const currentRecord = workspaceNameRecordSignal.get()
  const updatedRecord = { ...currentRecord }
  let hasChanges = false

  for (const workspace of workspaces) {
    if (workspace.name && workspace.workspaceHandle) {
      const oldValue = updatedRecord[workspace.workspaceHandle]
      if (oldValue !== workspace.name) {
        updatedRecord[workspace.workspaceHandle] = workspace.name
        hasChanges = true
      }
    }
  }

  if (hasChanges) {
    workspaceNameRecordSignal.set(updatedRecord)
  }

  return updatedRecord
}

function createWorkspaceNameRecordSignal(): SignalObject<Record<string, string>> {
  const signal = createSignalObject<Record<string, string>>({})

  // Load from localStorage if not already loaded
  if (!hasLoaded) {
    const result = workspaceNameLoadFromLocalStorage()
    if (result.success) {
      signal.set(result.data)
    }
    hasLoaded = true
  }

  // Override the set method to also save to localStorage
  const originalSet = signal.set
  signal.set = (value) => {
    const result = originalSet(value)
    workspaceNameSaveToLocalStorage(value)
    return result
  }

  // Listen to localStorage events to update record
  function handleStorageEvent(event: StorageEvent) {
    if (event.key === workspaceNameLocalStorageKey && event.newValue !== null) {
      const parsingResult = workspaceNameLoadFromLocalStorage(event.newValue)
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

export function workspaceNameLoadFromLocalStorage(
  read = localStorage.getItem(workspaceNameLocalStorageKey),
): Result<Record<string, string>> {
  const op = "workspaceNameLoadFromLocalStorage"
  if (!read) return createResultError(op, "no workspaceNameRecord saved in localStorage")

  const schema = a.pipe(a.string(), a.parseJson(), workspaceNameRecordSchema)
  const parsing = a.safeParse(schema, read)

  if (!parsing.success) {
    return createResultError(op, a.summarize(parsing.issues), read)
  }

  return createResult(parsing.output as Record<string, string>)
}

export function workspaceNameSaveToLocalStorage(record: Record<string, string>) {
  const serialized = JSON.stringify(record, null, 2)
  localStorage.setItem(workspaceNameLocalStorageKey, serialized)
}
