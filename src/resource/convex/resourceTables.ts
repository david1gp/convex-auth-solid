import { languageValidator } from "@/app/i18n/language"
import { resourceTypeValidator } from "@/resource/model_field/resourceType"
import { visibilityValidator } from "@/resource/model_field/visibility"
import { fieldsConvexCreatedAtUpdatedAt } from "@/utils/data/fieldsConvexCreatedAtUpdatedAt"
import { defineTable } from "convex/server"
import { v } from "convex/values"

export const resourceDataFields = {
  resourceId: v.string(),
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  type: v.optional(resourceTypeValidator),
  visibility: v.optional(visibilityValidator),
  image: v.optional(v.string()),
  language: v.optional(languageValidator),
} as const

export const resourceFields = {
  ...resourceDataFields,
  ...fieldsConvexCreatedAtUpdatedAt,
  deletedAt: v.optional(v.string()),
} as const

export const resourceFilesFields = {
  resourceId: v.string(),
  fileId: v.string(),
  createdAt: v.string(),
} as const

export const resourceTables = {
  resources: defineTable(resourceFields)
    //
    .index("resourceId", ["resourceId"])
    .index("visibility", ["visibility"]),

  resourceFiles: defineTable(resourceFilesFields)
    //
    .index("resourceId", ["resourceId"]),
} as const
