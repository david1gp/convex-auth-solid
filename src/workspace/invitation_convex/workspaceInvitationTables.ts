import { defineTable } from "convex/server"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.ts"
import { workspaceInvitationDataSchemaFields } from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"

export const workspaceInvitationTables = {
  workspaceInvitations: defineTable({
    ...valibotToConvex(workspaceInvitationDataSchemaFields),
    ...valibotToConvex(fieldsSchemaCreatedAtUpdatedAt),
  })
    .index("invitedEmail", ["invitedEmail"])
    .index("invitationCode", ["invitationCode"]),
} as const
