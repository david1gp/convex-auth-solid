import { resourceDataSchemaFields } from "@/resource/model/resourceSchema"
import { stringSchemaId } from "@/utils/valibot/stringSchema"
import { valibotToConvex } from "@/utils/convex/valibotToConvex"
import { fieldsSchemaCreatedAtUpdatedAt } from "@/utils/data/fieldsSchemaCreatedAtUpdatedAt"
import { fieldsSchemaCreatedAtUpdatedAtDeletedAt } from "@/utils/data/fieldsSchemaCreatedAtUpdatedAtDeletedAt"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import * as a from "valibot"

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
