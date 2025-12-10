import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"

export const fieldsSchemaCreatedAtUpdatedAt = {
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
} as const
