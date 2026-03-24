import { orgInvitationDataSchemaFields } from "#src/org/invitation_model/orgInvitationSchema.js"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.js"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.js"
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
