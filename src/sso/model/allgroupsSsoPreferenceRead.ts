import { allgroupsLocalStorageRead } from "./allgroupsLocalStorageRead.ts"
import { allgroupsSsoPreferenceSchema } from "./allgroupsSsoPreferenceSchema.ts"
import { allgroupsSsoStorageKeys } from "./allgroupsSsoStorageKeys.ts"

/** Reads the browser-local automatic sign-in preference, defaulting to false if absent or invalid. */
export const allgroupsSsoPreferenceRead = (storage?: Storage): boolean => {
  const result = allgroupsLocalStorageRead(allgroupsSsoStorageKeys.preference, allgroupsSsoPreferenceSchema, storage)
  if (!result.success || result.data === undefined) return false
  return result.data
}
