import { userRole, type UserRole } from "@/auth/model_field/userRole"
import { v } from "convex/values"

export const userRoleValidator = v.union(v.literal(userRole.user), v.literal(userRole.admin), v.literal(userRole.dev))

function types1(a: typeof userRoleValidator.type): UserRole {
  return a
}
