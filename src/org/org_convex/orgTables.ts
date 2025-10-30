import { orgRoleValidator } from "@/org/org_model/orgRoleValidator"
import { fieldsCreatedAtUpdatedAt } from "@convex/utils/fieldsCreatedAtUpdatedAt"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import { vIdUser } from "../../auth/convex/vIdUser"
import { vIdOrg } from "./vIdOrg"

export const orgDataFields = {
  // id
  orgHandle: v.string(),
  // data
  name: v.string(),
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
  ...fieldsCreatedAtUpdatedAt,
}

export const orgInvitationDataFields = {
  // ids
  orgId: vIdOrg,
  invitedEmail: v.string(),
  // data
  invitationCode: v.string(),
  role: orgRoleValidator,
  invitedBy: vIdUser,
  // server processing
  emailSendAt: v.optional(v.string()),
  emailSendAmount: v.number(),
  // acceptance
  acceptedAt: v.optional(v.string()),
} as const

export const orgInvitationFields = {
  // data
  ...orgInvitationDataFields,
  // meta
  ...fieldsCreatedAtUpdatedAt,
}

export const orgTables = {
  orgs: defineTable(orgFields)
    //
    .index("orgHandle", ["orgHandle"]),

  orgMembers: defineTable(orgMemberFields)
    //
    .index("orgId", ["orgId"])
    .index("userId", ["userId"]),

  orgInvitations: defineTable(orgInvitationFields)
    //
    .index("invitedEmail", ["invitedEmail"])
    .index("invitationCode", ["invitationCode"]),
} as const
