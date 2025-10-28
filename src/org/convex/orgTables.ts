import { orgRoleValidator } from "@/org/model/orgRoleValidator"
import { fieldsCreatedAtUpdatedAt } from "@convex/utils/fieldsCreatedAtUpdatedAt"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import { vIdUser } from "../../auth/convex/vIdUser"
import { vIdOrg } from "./vIdOrg"

export const orgDataFields = {
  // data
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  url: v.optional(v.string()),
  image: v.optional(v.string()),
} as const

export const orgFields = {
  ...orgDataFields,
  ...fieldsCreatedAtUpdatedAt,
} as const

export const orgMemberDataFields = {
  // ids
  orgId: vIdOrg,
  userId: vIdUser,
  // data
  role: orgRoleValidator,
  invitedBy: vIdUser,
} as const

export const orgMemberFields = {
  // data
  ...orgMemberDataFields,
  // meta
  joinedAt: v.string(),
  updatedAt: v.string(),
}

export const orgTables = {
  orgs: defineTable(orgFields)
    //
    .index("slug", ["slug"]),

  orgMembers: defineTable(orgMemberFields)
    //
    .index("orgId", ["orgId"])
    .index("userId", ["userId"]),
} as const
