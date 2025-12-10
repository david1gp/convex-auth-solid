import { fieldsSchemaCreatedAtUpdatedAt } from "@/utils/data/fieldsSchemaCreatedAtUpdatedAt"
import * as a from "valibot"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"

export const fieldsSchemaCreatedAtUpdatedAtDeletedAt = {
  ...fieldsSchemaCreatedAtUpdatedAt,
  deletedAt: a.optional(dateTimeSchema),
} as const
