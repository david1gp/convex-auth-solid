import { valibotToConvex } from "#src/utils/convex/valibotToConvex.js"
import { defineTable } from "convex/server"
import * as a from "valibot"

const kvDataSchemaFields = {
  key: a.string(),
  data: a.string(),
  updatedAt: a.string(),
} as const

export const kvTables = {
  kv: defineTable({
    ...valibotToConvex(kvDataSchemaFields),
  })
    //
    .index("byKey", ["key"]),
} as const
