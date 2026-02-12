import * as a from "valibot"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"

export const fieldsSchemaCreatedAt = {
  createdAt: dateTimeSchema,
} as const

export type FieldsSchemaCreatedAtType = typeof fieldsSchemaCreatedAt
