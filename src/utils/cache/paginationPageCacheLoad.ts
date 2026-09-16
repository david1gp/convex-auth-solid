import * as a from "valibot"
import type { Result } from "#result"
import { createResult } from "#result"
import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"
import { cachePrefix } from "#src/utils/ui/cachePrefix.ts"

export function paginationPageCacheLoad<T>(
  key: string,
  schema: a.BaseSchema<any, PaginationResultType<T>, any>,
  storage?: Storage,
): Result<PaginationResultType<T>> | undefined {
  const store = storage ?? paginationPageCacheStorageGet()
  if (!store) return undefined

  let read: string | null
  try {
    read = store.getItem(cachePrefix + key)
  } catch {
    return undefined
  }
  if (!read) return undefined

  const parsing = a.safeParse(a.pipe(a.string(), a.parseJson(), schema), read)
  if (!parsing.success) return undefined
  return createResult(parsing.output)
}

function paginationPageCacheStorageGet(): Storage | undefined {
  if (typeof localStorage === "undefined") return undefined
  return localStorage
}
