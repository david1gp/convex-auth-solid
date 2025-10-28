import { userRoleSchema, type UserRole } from "@/auth/model/userRole"
import * as v from "valibot"
import { inputMaxLength100, inputMaxLength25, inputMaxLength50, urlMaxLength } from "~ui/input/input/inputMaxLength"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"

export type UserProfile = {
  userId: string
  name: string
  username?: string
  image?: string
  email?: string
  emailVerifiedAt?: string
  hasPw: boolean
  role: UserRole
  createdAt: string
  deletedAt?: string
}

const string1to50Schema = v.pipe(v.string(), v.minLength(1), v.maxLength(inputMaxLength50))
const string5to25Schema = v.pipe(v.string(), v.minLength(5), v.maxLength(inputMaxLength25))
const string0to500Schema = v.pipe(v.string(), v.minLength(5), v.maxLength(urlMaxLength))
const string0to100Schema = v.pipe(v.string(), v.minLength(5), v.maxLength(inputMaxLength100))

export const userProfileSchema = v.object({
  userId: string1to50Schema,
  name: string1to50Schema,
  username: v.optional(string5to25Schema),
  image: v.optional(string0to500Schema),
  email: v.optional(string0to100Schema),
  emailVerifiedAt: v.optional(dateTimeSchema),
  hasPw: v.boolean(),
  role: userRoleSchema,
  createdAt: dateTimeSchema,
  deletedAt: v.optional(dateTimeSchema),
})

function types1(a: v.InferOutput<typeof userProfileSchema>): UserProfile {
  return a
}
