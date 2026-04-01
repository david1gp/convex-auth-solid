import { vIdUser } from "#src/auth/convex/vIdUser.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.ts"
import { stringSchemaId } from "#src/utils/valibot/stringSchema.ts"
import { vIdWorkspace } from "#src/workspace/workspace_convex/vIdWorkspace.ts"
import { workspaceRoleSchema } from "#src/workspace/workspace_model_field/workspaceRole.ts"
import { defineTable } from "convex/server"

const workspaceMemberTableDataSchemaFields = {
  workspaceHandle: stringSchemaId,
  role: workspaceRoleSchema,
  invitedBy: stringSchemaId,
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
