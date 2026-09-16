import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"

export function paginationResultMap<T, R>(
  result: PaginationResultType<T>,
  map: (item: T) => R,
): PaginationResultType<R> {
  return {
    page: result.page.map(map),
    isDone: result.isDone,
    continueCursor: result.continueCursor,
  }
}
