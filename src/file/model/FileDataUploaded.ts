import { fileIdSchema } from "@/file/model_field/fileIdSchema"
import { stringSchemaUrl } from "@/utils/valibot/stringSchema"
import { v } from "convex/values"
import * as a from "valibot"

export interface FileDataUploaded {
  fileId: string
  url: string
}

export const fileDataUploadedSchemaFields = {
  fileId: fileIdSchema,
  url: stringSchemaUrl,
} as const

export const fileDataUploadedSchema = a.object(fileDataUploadedSchemaFields)

export const fileDataUploadedConvexFields = {
  fileId: v.string(),
  url: v.string(),
} as const

export const fileDataUploadedValidator = v.object(fileDataUploadedConvexFields)

function types1(d: a.InferOutput<typeof fileDataUploadedSchema>): FileDataUploaded {
  return d
}

function types2(d: FileDataUploaded): a.InferOutput<typeof fileDataUploadedSchema> {
  return d
}

function types3(d: typeof fileDataUploadedValidator.type): FileDataUploaded {
  return d
}

function types4(d: FileDataUploaded): typeof fileDataUploadedValidator.type {
  return d
}
