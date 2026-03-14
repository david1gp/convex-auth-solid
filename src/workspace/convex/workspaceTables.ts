import { workspaceDataSchemaFields } from "@/workspace/model/workspaceSchema"
import { valibotToConvex } from "@/utils/convex/valibotToConvex"
import { fieldsSchemaCreatedAtUpdatedAt } from "@/utils/data/fieldsSchemaCreatedAtUpdatedAt"
import { defineTable } from "convex/server"

export const workspaceTables = {
  workspaces: defineTable({
    ...valibotToConvex(workspaceDataSchemaFields),
    ...valibotToConvex(fieldsSchemaCreatedAtUpdatedAt),
  })
    //
    .index("workspaceHandle", ["workspaceHandle"]),
} as const
