import { v } from "convex/values"
import { userRole, type UserRole } from "~auth/model/userRole"

export const userRoleValidator = v.union(v.literal(userRole.user), v.literal(userRole.admin), v.literal(userRole.dev))

function types1(a: typeof userRoleValidator.type): UserRole {
  return a
}
