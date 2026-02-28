import { languageValidator } from "@/app/i18n/language"
import { orgRoleValidator } from "@/org/org_model_field/orgRoleValidator"
import { fieldsConvexCreatedAtUpdatedAt } from "@/utils/data/fieldsConvexCreatedAtUpdatedAt"
import { defineTable } from "convex/server"
import { v } from "convex/values"

export const orgInvitationDataFields = {
  // ids
  orgHandle: v.string(),
  invitationCode: v.string(),
  // invited
  invitedName: v.string(),
  invitedEmail: v.string(),
  l: languageValidator,
  // data
  role: orgRoleValidator,
  invitedBy: v.string(),
  // server processing
  emailSendAt: v.optional(v.string()),
  emailSendAmount: v.number(),
} as const

export const orgInvitationFields = {
  // data
  ...orgInvitationDataFields,
  // meta
  ...fieldsConvexCreatedAtUpdatedAt,
}

export const orgInvitationTables = {
  orgInvitations: defineTable(orgInvitationFields)
    //
    .index("invitedEmail", ["invitedEmail"])
    .index("invitationCode", ["invitationCode"]),
} as const
