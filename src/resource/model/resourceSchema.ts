import { languageSchema } from "#src/app/i18n/language.js"
import type { DocResource } from "#src/resource/convex/IdResource.js"
import type { ResourceModel } from "#src/resource/model/ResourceModel.js"
import { resourceIdSchema } from "#src/resource/model/resourceIdSchema.js"
import { resourceTypeSchema } from "#src/resource/model_field/resourceType.js"
import { visibilitySchema } from "#src/resource/model_field/visibility.js"
import { fieldsSchemaCreatedAtUpdatedAtDeletedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAtDeletedAt.js"
import { stringSchemaDescription, stringSchemaName } from "#src/utils/valibot/stringSchema.js"
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
