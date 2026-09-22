import * as a from "valibot"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"

const userProfileUpdateFieldsSchema = {
  name: a.optional(a.string()),
  image: a.optional(a.string()),
  bio: a.optional(a.string()),
  url: a.optional(a.string()),
} as const

export const userProfileUpdateSchema = a.object({
  token: a.string(),
  ...userProfileUpdateFieldsSchema,
})

export const userProfileUpdateFields = valibotToConvex(userProfileUpdateFieldsSchema)
