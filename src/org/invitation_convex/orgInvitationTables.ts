import { orgInvitationDataSchemaFields } from "@/org/invitation_model/orgInvitationSchema"
import { valibotToConvex } from "@/utils/convex/valibotToConvex"
import { fieldsSchemaCreatedAtUpdatedAt } from "@/utils/data/fieldsSchemaCreatedAtUpdatedAt"
import { defineTable } from "convex/server"

export const orgInvitationTables = {
  orgInvitations: defineTable({
    ...valibotToConvex(orgInvitationDataSchemaFields),
    ...valibotToConvex(fieldsSchemaCreatedAtUpdatedAt),
  })
    //
    .index("invitedEmail", ["invitedEmail"])
    .index("invitationCode", ["invitationCode"]),
} as const
