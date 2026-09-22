import { allgroupsLocalStorageRead } from "./allgroupsLocalStorageRead.ts"
import { allgroupsSsoAttemptsSchema } from "./allgroupsSsoAttemptsSchema.ts"
import { allgroupsSsoStorageKeys } from "./allgroupsSsoStorageKeys.ts"

/** Reads the current automatic sign-in attempt count from browser storage, defaulting to 0. */
export const allgroupsSsoAttemptsRead = (storage?: Storage): number => {
  const result = allgroupsLocalStorageRead(allgroupsSsoStorageKeys.attempts, allgroupsSsoAttemptsSchema, storage)
  if (!result.success || result.data === undefined) return 0
  return result.data
}
