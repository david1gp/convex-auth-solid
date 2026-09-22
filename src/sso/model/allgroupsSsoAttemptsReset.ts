import { createResult, createResultError, type Result } from "#result"
import { allgroupsSsoStorageKeys } from "./allgroupsSsoStorageKeys.ts"

/** Resets the automatic sign-in attempt counter in browser storage. */
export const allgroupsSsoAttemptsReset = (storage?: Storage): Result<true> => {
  const op = "allgroupsSsoAttemptsReset"
  try {
    const target = storage ?? (typeof globalThis.localStorage === "undefined" ? undefined : globalThis.localStorage)
    if (target === undefined) {
      return createResultError(op, "localStorage is unavailable")
    }
    target.removeItem(allgroupsSsoStorageKeys.attempts)
    return createResult(true)
  } catch (error) {
    const message = error instanceof Error ? error.message : "The storage operation failed"
    return createResultError(op, `Could not write localStorage: ${message}`)
  }
}
