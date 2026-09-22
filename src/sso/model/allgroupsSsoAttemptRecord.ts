import { createResult, createResultError, type Result } from "#result"
import { allgroupsSsoAttemptsRead } from "./allgroupsSsoAttemptsRead.ts"
import { allgroupsSsoMaxAttempts } from "./allgroupsSsoMaxAttempts.ts"
import { allgroupsSsoStorageKeys } from "./allgroupsSsoStorageKeys.ts"

export type AllgroupsSsoAttemptResult = {
  allowed: boolean
  attempts: number
}

/**
 * Checks and records an automatic sign-in attempt. If the budget is exhausted,
 * disallows further automatic attempts without throwing or modifying the preference.
 */
export const allgroupsSsoAttemptRecord = (storage?: Storage): Result<AllgroupsSsoAttemptResult> => {
  const op = "allgroupsSsoAttemptRecord"
  const currentAttempts = allgroupsSsoAttemptsRead(storage)
  if (currentAttempts >= allgroupsSsoMaxAttempts) {
    return createResult({ allowed: false, attempts: currentAttempts })
  }

  const nextAttempts = currentAttempts + 1
  try {
    const target = storage ?? (typeof globalThis.localStorage === "undefined" ? undefined : globalThis.localStorage)
    if (target === undefined) {
      return createResultError(op, "localStorage is unavailable")
    }
    target.setItem(allgroupsSsoStorageKeys.attempts, JSON.stringify(nextAttempts))
  } catch (error) {
    const message = error instanceof Error ? error.message : "The storage operation failed"
    return createResultError(op, `Could not write localStorage: ${message}`)
  }

  return createResult({ allowed: true, attempts: nextAttempts })
}
