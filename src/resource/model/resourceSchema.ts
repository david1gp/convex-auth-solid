import { languageSchema } from "@/app/i18n/language"
import type { DocResource } from "@/resource/convex/IdResource"
import type { ResourceModel } from "@/resource/model/ResourceModel"
import { resourceIdSchema } from "@/resource/model/resourceIdSchema"
import { resourceTypeSchema } from "@/resource/model_field/resourceType"
import { visibilitySchema } from "@/resource/model_field/visibility"
import { fieldsSchemaCreatedAtUpdatedAtDeletedAt } from "@/utils/data/fieldsSchemaCreatedAtUpdatedAtDeletedAt"
import { stringSchemaDescription, stringSchemaName } from "@/utils/valibot/stringSchema"
import * as a from "valibot"

export const resourceDataSchemaFields = {
  resourceId: resourceIdSchema,
  // 1. General
  name: a.optional(stringSchemaName),
  description: a.optional(stringSchemaDescription),
  type: a.optional(resourceTypeSchema),
  // 2. Display
  visibility: a.optional(visibilitySchema),
  image: a.optional(a.string()),
  language: a.optional(languageSchema),
} as const

export const resourceDataSchema = a.object(resourceDataSchemaFields)

export const resourceSchema = a.object({
  ...resourceDataSchemaFields,
  ...fieldsSchemaCreatedAtUpdatedAtDeletedAt,
})

export function resourceDocToModel(m: DocResource): ResourceModel {
  return m
}
