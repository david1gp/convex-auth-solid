import { defineTable } from "convex/server"
import * as a from "valibot"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"

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
