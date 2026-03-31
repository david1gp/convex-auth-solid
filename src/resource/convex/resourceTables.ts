import { resourceDataSchemaFields } from "#src/resource/model/resourceSchema.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.ts"
import { stringSchemaId } from "#src/utils/valibot/stringSchema.ts"
import { dateTimeSchema } from "#utils/valibot/dateTimeSchema.js"
import { defineTable } from "convex/server"
import { v } from "convex/values"

const resourceFilesDataSchemaFields = {
  resourceId: stringSchemaId,
  fileId: stringSchemaId,
  createdAt: dateTimeSchema,
} as const

export const resourceTables = {
  resources: defineTable({
    ...valibotToConvex(resourceDataSchemaFields),
    ...valibotToConvex(fieldsSchemaCreatedAtUpdatedAt),
    deletedAt: v.optional(v.string()),
  })
    //
    .index("resourceId", ["resourceId"])
    .index("visibility", ["visibility"]),

  resourceFiles: defineTable({
    ...valibotToConvex(resourceFilesDataSchemaFields),
  })
    //
    .index("resourceId", ["resourceId"]),
} as const
