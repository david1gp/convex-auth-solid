import { fieldsConvexCreatedAtUpdatedAt } from "#src/utils/data/fieldsConvexCreatedAtUpdatedAt.ts"
import { v } from "convex/values"

export const fieldsConvexCreatedAtUpdatedAtDeletedAt = {
  ...fieldsConvexCreatedAtUpdatedAt,
  deletedAt: v.optional(v.string()),
} as const
