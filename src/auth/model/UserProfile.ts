import { userRoleSchema, type UserRole } from "@/auth/model/userRole"
import { userRoleValidator } from "@/auth/model/userRoleValidator"
import { orgRoleSchema, type OrgRole } from "@/org/org_model/orgRole"
import { orgRoleValidator } from "@/org/org_model/orgRoleValidator"
import { emailSchema } from "@/utils/valibot/emailSchema"
import { handleSchema } from "@/utils/valibot/handleSchema"
import { stringSchema0to500, stringSchema1to50 } from "@/utils/valibot/stringSchema"
import { v } from "convex/values"
import * as a from "valibot"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"

export type UserProfile = {
  userId: string
  name: string
  username?: string
  image?: string
  email?: string
  emailVerifiedAt?: string
  role: UserRole
  orgHandle?: string
  orgRole?: OrgRole
  createdAt: string
  deletedAt?: string
}

export const userProfileSchema = a.object({
  userId: stringSchema1to50,
  name: stringSchema1to50,
  username: a.optional(handleSchema),
  image: a.optional(stringSchema0to500),
  email: a.optional(emailSchema),
  emailVerifiedAt: a.optional(dateTimeSchema),
  role: userRoleSchema,
  orgHandle: a.optional(a.string()),
  orgRole: a.optional(orgRoleSchema),
  createdAt: dateTimeSchema,
  deletedAt: a.optional(dateTimeSchema),
})

function types1(a: a.InferOutput<typeof userProfileSchema>): UserProfile {
  return a
}

export const userProfileValidator = v.object({
  userId: v.string(),
  name: v.string(),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerifiedAt: v.optional(v.string()),
  role: userRoleValidator,
  orgHandle: v.optional(v.string()),
  orgRole: v.optional(orgRoleValidator),
  createdAt: v.string(),
  deletedAt: v.optional(v.string()),
})
