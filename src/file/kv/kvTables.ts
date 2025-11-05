import { defineTable } from "convex/server"
import { v } from "convex/values"

export const kvDataFields = {
  key: v.string(),
  data: v.string(),
  updatedAt: v.string(),
} as const

export const kvTables = {
  kv: defineTable(kvDataFields)
    //
    .index("byKey", ["key"]),
} as const
