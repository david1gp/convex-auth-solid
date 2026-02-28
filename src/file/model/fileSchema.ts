import { fileDataUnuploadedSchemaFields } from "@/file/model/FileDataUnuploaded"
import { fileDataUploadedSchemaFields } from "@/file/model/FileDataUploaded"
import { resourceIdSchema } from "@/resource/model/resourceIdSchema"
import { fieldsSchemaCreatedAtUpdatedAtDeletedAt } from "@/utils/data/fieldsSchemaCreatedAtUpdatedAtDeletedAt"
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
