import { vIdUser } from "#src/auth/convex/vIdUser.js"
import { fileSchemaFields } from "#src/file/model/fileSchema.js"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.js"
import { fieldsSchemaCreatedAtUpdatedAtDeletedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAtDeletedAt.js"
import { stringSchemaId } from "#src/utils/valibot/stringSchema.js"
import { defineTable } from "convex/server"
import * as a from "valibot"

const fileMetaDataSchemaFields = {
  fileId: stringSchemaId,
  username: a.optional(stringSchemaId),
} as const

const fileTableDataSchemaFields = {
  ...fileMetaDataSchemaFields,
  ...fileSchemaFields,
} as const

export const fileTables = {
  files: defineTable({
    userId: vIdUser,
    ...valibotToConvex(fileTableDataSchemaFields),
    ...valibotToConvex(fieldsSchemaCreatedAtUpdatedAtDeletedAt),
  })
    //
    .index("fileId", ["fileId"]),
} as const
