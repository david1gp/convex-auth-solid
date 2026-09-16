import { paginationOptsValidator as convexPaginationOptsValidator } from "convex/server"
import { v } from "convex/values"

export const paginationOptsValidator = v.optional(convexPaginationOptsValidator)
