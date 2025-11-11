import { cachePrefix } from "@/utils/ui/cachePrefix"
import type { BaseSchema } from "valibot"
import * as a from "valibot"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function createLocalStorageSignalObject<T>(
  key: string,
  schema: BaseSchema<any, T, any>,
  empty: T,
): SignalObject<T> {
  let hasLoaded = false
  const signal = createSignalObject<T>(empty)
  const localStorageKey = cachePrefix + key

  // Load from localStorage if not already loaded
  if (!hasLoaded) {
    const result = loadFromLocalStorage()
    if (result.success) {
      signal.set(result.data)
    }
    hasLoaded = true
  }

  // Override the set method to also save to localStorage
  const originalSet = signal.set
  signal.set = (value) => {
    const result = originalSet(value)
    saveToLocalStorage(value)
    return result
  }

  // Listen to localStorage events to update signal
  function handleStorageEvent(event: StorageEvent) {
    if (event.key === localStorageKey && event.newValue !== null) {
      const parsingResult = loadFromLocalStorage(event.newValue)
      if (!parsingResult.success) return
      signal.set(parsingResult.data)
    }
  }

  // Add event listener
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageEvent)
  }

  return signal

  function loadFromLocalStorage(read = localStorage.getItem(localStorageKey)): Result<T> {
    const op = "loadFromLocalStorage"
    if (!read) return createResultError(op, `no ${key} saved in localStorage`)
    const parsingSchema = a.pipe(a.string(), a.parseJson(), schema)
    const parsing = a.safeParse(parsingSchema, read)
    if (!parsing.success) {
      return createResultError(op, a.summarize(parsing.issues), read)
    }
    return createResult(parsing.output)
  }

  function saveToLocalStorage(value: T) {
    const op = "saveToLocalStorage"
    const serialized = JSON.stringify(value, null, 2)
    localStorage.setItem(localStorageKey, serialized)
  }
}
