import { fieldsConvexCreatedAtUpdatedAt } from "@/utils/data/fieldsConvexCreatedAtUpdatedAt"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import { vIdOrg } from "@/org/org_convex/vIdOrg"

export const orgDataFields = {
  // id
  orgHandle: v.string(),
  // data
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  url: v.optional(v.string()),
  image: v.optional(v.string()),
} as const

export const orgFields = {
  ...orgDataFields,
  ...fieldsConvexCreatedAtUpdatedAt,
} as const

export const orgResourceFields = {
  orgId: vIdOrg,
  orgHandle: v.string(),
  resourceId: v.string(),
  createdAt: v.string(),
} as const

export const orgMeetingsFields = {
  orgId: vIdOrg,
  orgHandle: v.string(),
  meetingId: v.string(),
  createdAt: v.string(),
} as const

export const orgTables = {
  orgs: defineTable(orgFields)
    //
    .index("orgHandle", ["orgHandle"]),

  orgResources: defineTable(orgResourceFields)
    //
    .index("orgHandle", ["orgHandle"]),

  orgMeetings: defineTable(orgMeetingsFields)
    //
    .index("orgHandle", ["orgHandle"]),
} as const
