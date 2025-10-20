import { v } from "convex/values"
import type { UserProfile } from "~auth/model/UserProfile"

// UserRole validator
export const userRoleValidator = v.union(v.literal("user"), v.literal("admin"), v.literal("dev"))

// LoginMethod validator
export const loginMethodValidator = v.union(
  v.literal("email"),
  v.literal("password"),
  v.literal("google"),
  v.literal("github"),
  v.literal("dev"),
)

// UserProfile validator
export const userProfileValidator = v.object({
  userId: v.string(),
  name: v.string(),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerifiedAt: v.optional(v.string()),
  hasPw: v.boolean(),
  role: userRoleValidator,
  createdAt: v.string(),
  deletedAt: v.optional(v.string()),
})

function types1(a: typeof userProfileValidator.type): UserProfile {
  return { ...a }
}

function types2(a: UserProfile): typeof userProfileValidator.type {
  return { ...a }
}
