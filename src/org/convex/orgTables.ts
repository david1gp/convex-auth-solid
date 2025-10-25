import { orgRoleValidator } from "@/org/model/orgRoleValidator"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import { vIdUsers } from "../../auth/convex/vIdUSers"
import { vIdOrgs } from "./vIdOrgs"

export const orgFields = {
  // data
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  url: v.optional(v.string()),
  image: v.optional(v.string()),
  // meta times
  createdAt: v.string(),
  createdBy: vIdUsers,
  updatedAt: v.string(),
  deletedAt: v.optional(v.string()),
}

export const orgMemberFields = {
  // ids
  orgId: vIdOrgs,
  userId: vIdUsers,
  // data
  role: orgRoleValidator,
  // meta
  joinedAt: v.string(),
  invitedBy: vIdUsers,
  updatedAt: v.string(),
  deletedAt: v.optional(v.string()),
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
