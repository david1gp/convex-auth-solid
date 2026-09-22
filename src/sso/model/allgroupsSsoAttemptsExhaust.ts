import { createResult, createResultError, type Result } from "#result"
import { allgroupsSsoMaxAttempts } from "./allgroupsSsoMaxAttempts.ts"
import { allgroupsSsoStorageKeys } from "./allgroupsSsoStorageKeys.ts"

/** Sets the attempt counter to the maximum to pause automatic sign-in (e.g. after deliberate logout). */
export const allgroupsSsoAttemptsExhaust = (storage?: Storage): Result<true> => {
  const op = "allgroupsSsoAttemptsExhaust"
  try {
    const target = storage ?? (typeof globalThis.localStorage === "undefined" ? undefined : globalThis.localStorage)
    if (target === undefined) {
      return createResultError(op, "localStorage is unavailable")
    }
    target.setItem(allgroupsSsoStorageKeys.attempts, JSON.stringify(allgroupsSsoMaxAttempts))
    return createResult(true)
  } catch (error) {
    const message = error instanceof Error ? error.message : "The storage operation failed"
    return createResultError(op, `Could not write localStorage: ${message}`)
  }
}
