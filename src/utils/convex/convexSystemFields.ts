import * as a from "valibot"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"

export const convexSystemFields = {
  _id: a.string(),
  _creationTime: a.number(),
} as const

export const fieldsCreatedAtUpdatedAt = {
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
} as const
