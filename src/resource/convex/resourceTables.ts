import { resourceDataSchemaFields } from "#src/resource/model/resourceSchema.js"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.js"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.js"
import { stringSchemaId } from "#src/utils/valibot/stringSchema.js"
import { dateTimeSchema } from "#utils/valibot/dateTimeSchema"
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
