import * as a from "valibot"
import { createResult, createResultError, type Result } from "#result"
import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"
import { cachePrefix } from "#src/utils/ui/cachePrefix.ts"

export function paginationPageCacheSave<T>(
  key: string,
  value: PaginationResultType<T>,
  schema: a.BaseSchema<any, PaginationResultType<T>, any>,
  storage?: Storage,
): Result<null> {
  const op = "paginationPageCacheSave"
  const store = storage ?? paginationPageCacheStorageGet()
  if (!store) return createResultError(op, "localStorage unavailable")

  const parsing = a.safeParse(schema, value)
  if (!parsing.success) return createResultError(op, a.summarize(parsing.issues), JSON.stringify(value))

  try {
    store.setItem(cachePrefix + key, JSON.stringify(parsing.output))
  } catch (error) {
    return createResultError(op, error instanceof Error ? error.message : String(error))
  }
  return createResult(null)
}

function paginationPageCacheStorageGet(): Storage | undefined {
  if (typeof localStorage === "undefined") return undefined
  return localStorage
}
