import { defineTable } from "convex/server"
import { vIdUser } from "#src/auth/convex/vIdUser.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.ts"
import { workspaceMemberDataSchemaFields } from "#src/workspace/member_model/WorkspaceMemberSchema.ts"
import { vIdWorkspace } from "#src/workspace/workspace_convex/vIdWorkspace.ts"

const workspaceMemberTableDataSchemaFields = {
  workspaceHandle: workspaceMemberDataSchemaFields.workspaceHandle,
  role: workspaceMemberDataSchemaFields.role,
  invitedBy: workspaceMemberDataSchemaFields.invitedBy,
} as const

export const workspaceMemberTables = {
  workspaceMembers: defineTable({
    workspaceId: vIdWorkspace,
    userId: vIdUser,
    ...valibotToConvex(workspaceMemberTableDataSchemaFields),
    ...valibotToConvex(fieldsSchemaCreatedAtUpdatedAt),
  })
    .index("workspaceId", ["workspaceId"])
    .index("userId", ["userId"]),
} as const
