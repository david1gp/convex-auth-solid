import { v } from "convex/values"

export const fieldsCreatedAtUpdatedAt = {
  createdAt: v.string(),
  updatedAt: v.string(),
} as const

export const fieldsCreatedAtUpdatedAtDeletedAt = {
  ...fieldsCreatedAtUpdatedAt,
  deletedAt: v.optional(v.string()),
} as const
