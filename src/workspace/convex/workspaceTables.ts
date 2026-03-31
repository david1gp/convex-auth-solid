import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.ts"
import { workspaceDataSchemaFields } from "#src/workspace/model/workspaceSchema.ts"
import { defineTable } from "convex/server"

export const workspaceTables = {
  workspaces: defineTable({
    ...valibotToConvex(workspaceDataSchemaFields),
    ...valibotToConvex(fieldsSchemaCreatedAtUpdatedAt),
  })
    //
    .index("workspaceHandle", ["workspaceHandle"]),
} as const
