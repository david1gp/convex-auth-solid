import { workspaceInvitationDataSchemaFields } from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.ts"
import { defineTable } from "convex/server"

export const workspaceInvitationTables = {
  workspaceInvitations: defineTable({
    ...valibotToConvex(workspaceInvitationDataSchemaFields),
    ...valibotToConvex(fieldsSchemaCreatedAtUpdatedAt),
  })
    .index("invitedEmail", ["invitedEmail"])
    .index("invitationCode", ["invitationCode"]),
} as const
