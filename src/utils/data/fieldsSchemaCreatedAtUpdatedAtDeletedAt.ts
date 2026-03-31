import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.ts"
import { dateTimeSchema } from "#utils/valibot/dateTimeSchema.js"
import * as a from "valibot"

export const fieldsSchemaCreatedAtUpdatedAtDeletedAt = {
  ...fieldsSchemaCreatedAtUpdatedAt,
  deletedAt: a.optional(dateTimeSchema),
} as const
