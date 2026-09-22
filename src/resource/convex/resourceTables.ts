import { defineTable } from "convex/server"
import * as a from "valibot"
import { resourceDataSchemaFields } from "#src/resource/model/resourceSchema.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { fieldsSchemaCreatedAtUpdatedAtDeletedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAtDeletedAt.ts"
import { stringSchemaId } from "#src/utils/valibot/stringSchema.ts"
import { dateTimeSchema } from "#utils/valibot/dateTimeSchema.js"

const resourceFilesDataSchemaFields = {
  resourceId: stringSchemaId,
  fileId: stringSchemaId,
  createdAt: dateTimeSchema,
} as const

export const resourceTables = {
  resources: defineTable({
    ...valibotToConvex(resourceDataSchemaFields),
    ...valibotToConvex(fieldsSchemaCreatedAtUpdatedAtDeletedAt),
    ...valibotToConvex({ searchText: a.optional(a.string()) }),
  })
    //
    .index("resourceId", ["resourceId"])
    .index("visibility", ["visibility"])
    .index("type", ["type"])
    .index("language", ["language"])
    .searchIndex("search", {
      searchField: "searchText",
      filterFields: ["type", "visibility", "language"],
    }),

  resourceFiles: defineTable({
    ...valibotToConvex(resourceFilesDataSchemaFields),
  })
    //
    .index("resourceId", ["resourceId"]),
} as const
