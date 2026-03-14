import { fileDataUnuploadedSchemaFields } from "@/file/model/FileDataUnuploaded"
import { fileDataUploadedSchemaFields } from "@/file/model/FileDataUploaded"
import { fileSchemaFields } from "@/file/model/fileSchema"
import { fieldsSchemaCreatedAtUpdatedAtDeletedAt } from "@/utils/data/fieldsSchemaCreatedAtUpdatedAtDeletedAt"
import { stringSchemaId } from "@/utils/valibot/stringSchema"
import { valibotToConvex } from "@/utils/convex/valibotToConvex"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import * as a from "valibot"
import { vIdUser } from "@/auth/convex/vIdUser"

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
