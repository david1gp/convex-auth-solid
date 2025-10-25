import { userSessionSchema, type UserSession } from "@/auth/model/UserSession"
import * as v from "valibot"
import { createSignalObject, type SetterSimplified, type SignalObject } from "~ui/utils/createSignalObject"
import { createResult, createResultError, type Result } from "~utils/result/Result"

const userSessionsSessionStorageKey = "userSession"
let hasLoaded = false

export const userSessionSignal: SignalObject<UserSession | null> = createUserSessionsSignal()

export function userSessionGet(): UserSession {
  return userSessionSignal.get() as UserSession
}

export function userTokenGet(): string {
  const session = userSessionSignal.get()
  if (!session) return ""
  return session.token
}

function createUserSessionsSignal(): SignalObject<UserSession | null> {
  const signal = createSignalObject<UserSession | null>(null)

  // Load from localStorage if not already loaded
  if (!hasLoaded) {
    const result = userSessionLoadFromSessionStorage()
    if (result.success) {
      signal.set(result.data)
    }
    hasLoaded = true
  }

  // Override the set method to also save to localStorage
  const originalSet: SetterSimplified<UserSession | null> = signal.set
  signal.set = (value) => {
    const result = originalSet(value)
    userSessionSaveToSessionStorage(value)
    return result
  }

  return signal
}

function userSessionLoadFromSessionStorage(): Result<UserSession> {
  const op = "userSessionsLoadFromLocalStorage"
  const read = sessionStorage.getItem(userSessionsSessionStorageKey)
  if (!read) return createResultError(op, "no userSession saved in sessionStorage")
  const schema = v.pipe(v.string(), v.parseJson(), userSessionSchema)
  const parsing = v.safeParse(schema, read)
  if (!parsing.success) {
    return createResultError(op, v.summarize(parsing.issues), read)
  }
  return createResult(parsing.output)
}

function userSessionSaveToSessionStorage(sessions: UserSession | null) {
  const op = "userSessionSaveToSessionStorage"
  const serialized = JSON.stringify(sessions, null, 2)
  sessionStorage.setItem(userSessionsSessionStorageKey, serialized)
}
