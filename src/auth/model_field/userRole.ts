import * as a from "valibot"

export type UserRole = keyof typeof userRole

export const userRole = {
  user: "user",
  admin: "admin",
  dev: "dev",
} as const

export const userRoleSchema = a.enum(userRole)

function types1(a: a.InferOutput<typeof userRoleSchema>): UserRole {
  return a
}
