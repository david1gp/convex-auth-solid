import { languageOrNoneValidator } from "@/app/i18n/language"
import { vIdUser } from "@/auth/convex/vIdUser"
import { fileDataUnuploadedConvexFields } from "@/file/model/FileDataUnuploaded"
import { fileDataUploadedConvexFields } from "@/file/model/FileDataUploaded"
import { fieldsConvexCreatedAtUpdatedAtDeletedAt } from "@/utils/data/fieldsConvexCreatedAtUpdatedAtDeletedAt"
import { defineTable } from "convex/server"
import { v } from "convex/values"

export const fileMetaFields = {
  // meta
  fileId: v.string(),
  resourceId: v.optional(v.string()),
  userId: vIdUser,
  username: v.optional(v.string()),
  language: v.optional(languageOrNoneValidator),
} as const

export const fileUploadedFields = {
  ...fileMetaFields,
  // data
  ...fileDataUnuploadedConvexFields,
  // uploaded
  ...fileDataUploadedConvexFields,
} as const

export const fileFields = {
  ...fileUploadedFields,
  ...fieldsConvexCreatedAtUpdatedAtDeletedAt,
} as const

export const fileTables = {
  files: defineTable(fileFields)
    //
    .index("fileId", ["fileId"]),
} as const
