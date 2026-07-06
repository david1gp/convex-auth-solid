import { defineTable } from "convex/server"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.ts"
import { workspaceDataSchemaFields } from "#src/workspace/workspace_model/workspaceSchema.ts"

export const workspaceTables = {
  workspaces: defineTable({
    ...valibotToConvex(workspaceDataSchemaFields),
    ...valibotToConvex(fieldsSchemaCreatedAtUpdatedAt),
  })
    //
    .index("workspaceHandle", ["workspaceHandle"]),
} as const
