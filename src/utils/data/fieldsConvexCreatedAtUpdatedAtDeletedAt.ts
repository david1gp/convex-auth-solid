import { fieldsConvexCreatedAtUpdatedAt } from "#src/utils/data/fieldsConvexCreatedAtUpdatedAt.js"
import { v } from "convex/values"

export const fieldsConvexCreatedAtUpdatedAtDeletedAt = {
  ...fieldsConvexCreatedAtUpdatedAt,
  deletedAt: v.optional(v.string()),
} as const
