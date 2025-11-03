import { vIdUser } from "@/auth/convex/vIdUser"
import { vIdOrg } from "@/org/org_convex/vIdOrg"
import { fieldsCreatedAtUpdatedAt } from "@convex/utils/fieldsCreatedAtUpdatedAt"
import { defineTable } from "convex/server"
import { v } from "convex/values"

export const workspaceDataFields = {
  userId: v.optional(vIdUser),
  orgId: v.optional(vIdOrg),
  workspaceHandle: v.string(),
  // data
  name: v.string(),
  description: v.optional(v.string()),
  image: v.optional(v.string()),
  url: v.optional(v.string()),
} as const

export const workspaceFields = {
  ...workspaceDataFields,
  ...fieldsCreatedAtUpdatedAt,
} as const

export const workspaceTables = {
  workspaces: defineTable(workspaceFields)
    //
    .index("workspaceHandle", ["workspaceHandle"]),
} as const
