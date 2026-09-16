import type { PaginationOptions } from "convex/server"

export const paginationDefaultOptions = {
  numItems: 50,
  cursor: null,
} satisfies Pick<PaginationOptions, "numItems" | "cursor">
