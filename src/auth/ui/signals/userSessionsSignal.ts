import { userSessionIsStillValid, userSessionSchema, type UserSession } from "@/auth/model/UserSession"
import * as v from "valibot"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"
import { createResult, createResultError } from "~utils/result/Result"

const userSessionsLocalStorageKey = "userSessions"
const userSessionsSchema = v.array(userSessionSchema)
let hasLoaded = false

export const userSessionsSignal: SignalObject<UserSession[]> = createUserSessionsSignal()

export function userSessionsSignalAdd(newSession: UserSession): UserSession[] {
  const userSessions = userSessionsSignal.get()
  const newSessions = addUserSesssionOrReplace(userSessions, newSession)
  userSessionsSignal.set(newSessions)
  return newSessions
}

function addUserSesssionOrReplace(userSessions: UserSession[], userProfile: UserSession) {
  const existingUserIndex = userSessions.findIndex((session) => session.user.userId === userProfile.user.userId)
  const newSessions = [...userSessions]

  if (existingUserIndex !== -1) {
    // Update existing user session
    newSessions[existingUserIndex] = userProfile
  } else {
    // Add new user session
    newSessions.push(userProfile)
  }
  return newSessions
}

function createUserSessionsSignal(): SignalObject<UserSession[]> {
  const signal = createSignalObject<UserSession[]>([])

  // Load from localStorage if not already loaded
  if (!hasLoaded) {
    const result = userSessionsLoadFromLocalStorage()
    if (result.success) {
      signal.set(result.data)
    }
    hasLoaded = true
  }

  // Override the set method to also save to localStorage
  const originalSet = signal.set
  signal.set = (value) => {
    const result = originalSet(value)
    userSessionsSaveToLocalStorage(result)
    return result
  }

  // Listen to localStorage events to update session list
  function handleStorageEvent(event: StorageEvent) {
    if (event.key === userSessionsLocalStorageKey && event.newValue !== null) {
      const schema = v.pipe(v.string(), v.parseJson(), userSessionsSchema)
      const parsing = v.safeParse(schema, event.newValue)
      if (parsing.success) {
        signal.set(parsing.output)
      }
    }
  }

  // Add event listener
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageEvent)
  }

  return signal
}

export function userSessionsLoadFromLocalStorage() {
  const op = "userSessionsLoadFromLocalStorage"
  const read = localStorage.getItem(userSessionsLocalStorageKey)
  if (!read) return createResultError(op, "no userSessions saved in localStorage")
  const schema = v.pipe(v.string(), v.parseJson(), userSessionsSchema)
  const parsing = v.safeParse(schema, read)
  if (!parsing.success) {
    return createResultError(op, v.summarize(parsing.issues), read)
  }
  // filter by expiredAt
  const filtered = parsing.output.filter(userSessionIsStillValid)
  return createResult(filtered)
}

export function userSessionsSaveToLocalStorage(sessions: UserSession[]) {
  const op = "userSessionsSaveToLocalStorage"
  const serialized = JSON.stringify(sessions, null, 2)
  localStorage.setItem(userSessionsLocalStorageKey, serialized)
}
