import { cachePrefix } from "@/utils/ui/cachePrefix"
import type { BaseSchema } from "valibot"
import * as a from "valibot"
import { createResult, createResultError, type Result } from "~utils/result/Result"

const enabled = true

export function createQueryCached<T>(
  queryFn: () => Result<T> | undefined,
  key: string,
  schema: BaseSchema<any, T, any>,
): () => Result<T> | undefined {
  const localStorageKey = cachePrefix + key
  let cachedResult: Result<T> | null = null

  return function queryCached(): Result<T> | undefined {
    const result = queryFn()
    if (result) {
      if (enabled && result.success) {
        saveToLocalStorage(localStorageKey, result.data)
      }
      return result
    }
    // If queryFn returns undefined, try to load from cache (only once)
    if (enabled && !cachedResult) {
      cachedResult = loadFromLocalStorage(localStorageKey, schema)
    }
    return !enabled ? undefined : cachedResult && cachedResult.success ? cachedResult : undefined
  }
}

function loadFromLocalStorage<T>(key: string, schema: BaseSchema<any, T, any>, read?: string): Result<T> {
  const op = "loadFromLocalStorage"
  console.log(op, key)
  const readValue = read ?? localStorage.getItem(key)
  if (!readValue) return createResultError(op, `no ${key} saved in localStorage`)
  const parsingSchema = a.pipe(a.string(), a.parseJson(), schema)
  const parsing = a.safeParse(parsingSchema, readValue)
  if (!parsing.success) {
    return createResultError(op, a.summarize(parsing.issues), readValue)
  }
  return createResult(parsing.output)
}

function saveToLocalStorage<T>(key: string, value: T) {
  const op = "saveToLocalStorage"
  const serialized = JSON.stringify(value, null, 2)
  localStorage.setItem(key, serialized)
}
