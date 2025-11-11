import type { OrgModel } from "@/org/org_model/OrgModel"
import { cachePrefix } from "@/utils/ui/cachePrefix"
import * as a from "valibot"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"
import { createResult, createResultError, type Result } from "~utils/result/Result"

let hasLoaded = false

const orgNameLocalStorageKey = cachePrefix + "orgNameRecord"
const orgNameRecordSchema = a.record(a.string(), a.string())

export const orgNameRecordSignal: SignalObject<Record<string, string>> = createOrgNameRecordSignal()

export function orgNameSet(orgHandle: string, orgName: string): Record<string, string> {
  const currentRecord = orgNameRecordSignal.get()
  const oldValue = currentRecord[orgHandle]

  // Only save if the value has actually changed
  if (oldValue === orgName) {
    return currentRecord
  }

  const newRecord = { ...currentRecord, [orgHandle]: orgName }
  orgNameRecordSignal.set(newRecord)
  return newRecord
}

export function orgNameGet(orgHandle: string): string | undefined {
  const record = orgNameRecordSignal.get()
  return record[orgHandle]
}

export function orgNameAddList(orgs: OrgModel[]): Record<string, string> {
  const currentRecord = orgNameRecordSignal.get()
  const updatedRecord = { ...currentRecord }
  let hasChanges = false

  for (const org of orgs) {
    if (org.name && org.orgHandle) {
      const oldValue = updatedRecord[org.orgHandle]
      if (oldValue !== org.name) {
        updatedRecord[org.orgHandle] = org.name
        hasChanges = true
      }
    }
  }

  if (hasChanges) {
    orgNameRecordSignal.set(updatedRecord)
  }

  return updatedRecord
}

function createOrgNameRecordSignal(): SignalObject<Record<string, string>> {
  const signal = createSignalObject<Record<string, string>>({})

  // Load from localStorage if not already loaded
  if (!hasLoaded) {
    const result = orgNameLoadFromLocalStorage()
    if (result.success) {
      signal.set(result.data)
    }
    hasLoaded = true
  }

  // Override the set method to also save to localStorage
  const originalSet = signal.set
  signal.set = (value) => {
    const result = originalSet(value)
    orgNameSaveToLocalStorage(value)
    return result
  }

  // Listen to localStorage events to update record
  function handleStorageEvent(event: StorageEvent) {
    if (event.key === orgNameLocalStorageKey && event.newValue !== null) {
      const parsingResult = orgNameLoadFromLocalStorage(event.newValue)
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

export function orgNameLoadFromLocalStorage(
  read = localStorage.getItem(orgNameLocalStorageKey),
): Result<Record<string, string>> {
  const op = "orgNameLoadFromLocalStorage"
  if (!read) return createResultError(op, "no orgNameRecord saved in localStorage")

  const schema = a.pipe(a.string(), a.parseJson(), orgNameRecordSchema)
  const parsing = a.safeParse(schema, read)

  if (!parsing.success) {
    return createResultError(op, a.summarize(parsing.issues), read)
  }

  return createResult(parsing.output as Record<string, string>)
}

export function orgNameSaveToLocalStorage(record: Record<string, string>) {
  const serialized = JSON.stringify(record, null, 2)
  localStorage.setItem(orgNameLocalStorageKey, serialized)
}
