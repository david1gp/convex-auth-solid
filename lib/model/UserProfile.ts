import * as v from "valibot"
import { userRoleSchema, type UserRole } from "~auth/model/userRole"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"

export type UserProfile = {
  userId: string
  name: string
  image?: string
  email?: string
  emailVerifiedAt?: string
  hasPw: boolean
  role: UserRole
  createdAt: string
  deletedAt?: string
}

export const userProfileSchema = v.object({
  userId: v.string(),
  name: v.string(),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerifiedAt: v.optional(v.string()),
  hasPw: v.boolean(),
  role: userRoleSchema,
  createdAt: dateTimeSchema,
  deletedAt: v.optional(dateTimeSchema),
})

function types1(a: v.InferOutput<typeof userProfileSchema>): UserProfile {
  return a
}
