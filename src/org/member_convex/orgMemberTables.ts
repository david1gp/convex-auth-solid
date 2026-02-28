import { vIdOrg } from "@/org/org_convex/vIdOrg"
import { orgRoleValidator } from "@/org/org_model_field/orgRoleValidator"
import { fieldsConvexCreatedAtUpdatedAt } from "@/utils/data/fieldsConvexCreatedAtUpdatedAt"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import { vIdUser } from "@/auth/convex/vIdUser"

export const orgMemberDataFields = {
  // ids
  orgId: vIdOrg,
  orgHandle: v.string(),
  userId: vIdUser,
  // data
  role: orgRoleValidator,
  invitedBy: vIdUser,
} as const

export const orgMemberFields = {
  // data
  ...orgMemberDataFields,
  // meta
  ...fieldsConvexCreatedAtUpdatedAt,
}

export const orgMemberTables = {
  orgMembers: defineTable(orgMemberFields)
    //
    .index("orgId", ["orgId"])
    .index("userId", ["userId"]),
} as const
