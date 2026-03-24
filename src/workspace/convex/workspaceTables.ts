import { valibotToConvex } from "#src/utils/convex/valibotToConvex.js"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.js"
import { workspaceDataSchemaFields } from "#src/workspace/model/workspaceSchema.js"
import { defineTable } from "convex/server"

export const workspaceTables = {
  workspaces: defineTable({
    ...valibotToConvex(workspaceDataSchemaFields),
    ...valibotToConvex(fieldsSchemaCreatedAtUpdatedAt),
  })
    //
    .index("workspaceHandle", ["workspaceHandle"]),
} as const
