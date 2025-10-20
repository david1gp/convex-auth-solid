import * as v from "valibot"

export type UserRole = keyof typeof userRole

export const userRole = {
  user: "user",
  admin: "admin",
  dev: "dev",
} as const

export const userRoleSchema = v.enum(userRole)

function types1(a: v.InferOutput<typeof userRoleSchema>): UserRole {
  return a
}
