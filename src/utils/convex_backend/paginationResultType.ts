import type { PaginationResult } from "convex/server"

export type PaginationResultType<T> = Pick<PaginationResult<T>, "page" | "isDone" | "continueCursor">
