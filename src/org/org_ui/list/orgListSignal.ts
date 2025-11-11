import type { OrgModel } from "@/org/org_model/OrgModel"
import { orgSchema } from "@/org/org_model/orgSchema"
import { cachePrefix } from "@/utils/ui/cachePrefix"
import * as a from "valibot"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"
import { createResult, createResultError, type Result } from "~utils/result/Result"

const orgListLocalStorageKey = cachePrefix + "orgList"

export const orgListSignal: SignalObject<OrgModel[]> = createOrgListSignal()

export function orgListSignalAdd(newOrg: OrgModel): OrgModel[] {
  const orgList = orgListSignal.get()
  const newOrgs = orgListAddOrReplace(orgList, newOrg)
  orgListSignal.set(newOrgs)
  return newOrgs
}

function orgListAddOrReplace(orgs: OrgModel[], newOrg: OrgModel): OrgModel[] {
  const existingOrgIndex = orgs.findIndex((org) => org.orgHandle === newOrg.orgHandle)
  const newOrgs = [...orgs]

  if (existingOrgIndex !== -1) {
    // Update existing org
    newOrgs[existingOrgIndex] = newOrg
  } else {
    // Add new org
    newOrgs.push(newOrg)
  }
  return newOrgs
}

function createOrgListSignal(): SignalObject<OrgModel[]> {
  let hasLoaded = false
  const signal = createSignalObject<OrgModel[]>([])

  // Load from localStorage if not already loaded
  if (!hasLoaded) {
    const result = orgListLoadFromLocalStorage()
    if (result.success) {
      signal.set(result.data)
    }
    hasLoaded = true
  }

  // Override the set method to also save to localStorage
  const originalSet = signal.set
  signal.set = (value) => {
    const result = originalSet(value)
    orgListSaveToLocalStorage(value)
    return result
  }

  // Listen to localStorage events to update org list
  function handleStorageEvent(event: StorageEvent) {
    if (event.key === orgListLocalStorageKey && event.newValue !== null) {
      const parsingResult = orgListLoadFromLocalStorage(event.newValue)
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

export function orgListLoadFromLocalStorage(read = localStorage.getItem(orgListLocalStorageKey)): Result<OrgModel[]> {
  const op = "orgListLoadFromLocalStorage"
  // const read = localStorage.getItem(orgListLocalStorageKey)
  if (!read) return createResultError(op, "no orgList saved in localStorage")
  const orgListSchema = a.array(orgSchema)
  const schema = a.pipe(a.string(), a.parseJson(), orgListSchema)
  const parsing = a.safeParse(schema, read)
  if (!parsing.success) {
    return createResultError(op, a.summarize(parsing.issues), read)
  }
  return createResult(parsing.output as OrgModel[])
}

export function orgListSaveToLocalStorage(orgs: OrgModel[]) {
  const op = "orgListSaveToLocalStorage"
  const serialized = JSON.stringify(orgs, null, 2)
  localStorage.setItem(orgListLocalStorageKey, serialized)
}

export function orgListFindByHandle(orgHandle: string): OrgModel | undefined {
  const orgList = orgListSignal.get()
  return orgList.find((o) => o.orgHandle === orgHandle)
}

export function orgListFindNameByHandle(handle: string): string | undefined {
  if (!handle) return undefined
  const org = orgListFindByHandle(handle)
  if (!org) return undefined
  return org.name
}
