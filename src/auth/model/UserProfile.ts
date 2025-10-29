import { emailSchema } from "@/auth/model/emailSchema"
import { userRoleSchema, type UserRole } from "@/auth/model/userRole"
import { orgRoleSchema, type OrgRole } from "@/org/org_model/orgRole"
import { stringSchema0to500, stringSchema1to50, stringSchema5to25 } from "@/utils/valibot/stringSchema"
import * as v from "valibot"
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
  orgHandle?: string
  orgRole?: OrgRole
  createdAt: string
  deletedAt?: string
}

export const userProfileSchema = v.object({
  userId: stringSchema1to50,
  name: stringSchema1to50,
  username: v.optional(stringSchema5to25),
  image: v.optional(stringSchema0to500),
  email: v.optional(emailSchema),
  emailVerifiedAt: v.optional(dateTimeSchema),
  hasPw: v.boolean(),
  role: userRoleSchema,
  orgHandle: v.optional(v.string()),
  orgRole: v.optional(orgRoleSchema),
  createdAt: dateTimeSchema,
  deletedAt: v.optional(dateTimeSchema),
})

function types1(a: v.InferOutput<typeof userProfileSchema>): UserProfile {
  return a
}
