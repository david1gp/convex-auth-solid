import { fieldsConvexCreatedAtUpdatedAt } from "@/utils/data/fieldsConvexCreatedAtUpdatedAt"
import { v } from "convex/values"

export const fieldsConvexCreatedAtUpdatedAtDeletedAt = {
  ...fieldsConvexCreatedAtUpdatedAt,
  deletedAt: v.optional(v.string()),
} as const
