import { fileDataUnuploadedSchemaFields } from "#src/file/model/FileDataUnuploaded.js"
import { fileDataUploadedSchemaFields } from "#src/file/model/FileDataUploaded.js"
import { resourceIdSchema } from "#src/resource/model/resourceIdSchema.js"
import { fieldsSchemaCreatedAtUpdatedAtDeletedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAtDeletedAt.js"
import * as a from "valibot"

export const fileSchemaFields = {
  // meta
  resourceId: a.optional(resourceIdSchema),
  // data
  ...fileDataUnuploadedSchemaFields,
  // uploaded
  ...fileDataUploadedSchemaFields,
} as const

export const fileDataSchema = a.object(fileSchemaFields)

export const fileSchema = a.object({
  ...fileSchemaFields,
  ...fieldsSchemaCreatedAtUpdatedAtDeletedAt,
})
