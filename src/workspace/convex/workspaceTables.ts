import { fieldsConvexCreatedAtUpdatedAt } from "@/utils/data/fieldsConvexCreatedAtUpdatedAt"
import { defineTable } from "convex/server"
import { v } from "convex/values"

export const workspaceDataFields = {
  username: v.optional(v.string()),
  orgHandle: v.optional(v.string()),
  workspaceHandle: v.string(),
  // data
  name: v.string(),
  subtitle: v.optional(v.string()),
  image: v.optional(v.string()),
  url: v.optional(v.string()),
} as const

export const workspaceFields = {
  ...workspaceDataFields,
  ...fieldsConvexCreatedAtUpdatedAt,
} as const

export const workspaceTables = {
  workspaces: defineTable(workspaceFields)
    //
    .index("workspaceHandle", ["workspaceHandle"]),
} as const
