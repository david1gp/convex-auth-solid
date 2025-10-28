import * as v from "valibot"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"

export const convexSystemFields = {
  _id: v.string(),
  _creationTime: v.number(),
} as const

export const fieldsCreatedAtUpdatedAt = {
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
} as const
