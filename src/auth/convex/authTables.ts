import { loginMethodValidator } from "@/auth/model/loginMethodValidator"
import { userRoleValidator } from "@/auth/model/userRoleValidator"
import { fieldsCreatedAtUpdatedAt, fieldsCreatedAtUpdatedAtDeletedAt } from "@convex/utils/fieldsCreatedAtUpdatedAt"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import { vIdUsers } from "./vIdUSers"

export const userFields = {
  // data
  name: v.string(),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerifiedAt: v.optional(v.string()),
  hashedPassword: v.optional(v.string()),
  role: userRoleValidator,
  // meta times
  createdAt: v.string(),
  deletedAt: v.optional(v.string()),
}

export const authAccountFields = {
  // ids
  userId: vIdUsers,
  // data
  provider: v.string(),
  providerAccountId: v.string(),
  // meta times
  ...fieldsCreatedAtUpdatedAt,
}

export const authSessionFields = {
  // ids
  userId: vIdUsers,
  // data
  loginMethod: v.union(loginMethodValidator),
  token: v.string(),
  expiresAt: v.string(),
  // meta times
  ...fieldsCreatedAtUpdatedAtDeletedAt,
}

export const authRateLimitFields = {
  identifier: v.string(),
  attemptsLeft: v.number(),
  // meta times
  lastAttemptedAt: v.number(),
}

export const authUserEmailRegistrationFields = {
  // data
  email: v.string(),
  code: v.string(),
  name: v.string(),
  hashedPassword: v.optional(v.string()),
  // meta
  createdAt: v.string(),
  consumedAt: v.optional(v.string()),
}

export const authEmailLoginCodeFields = {
  // data
  userId: vIdUsers,
  code: v.string(),
  email: v.string(),
  // meta
  createdAt: v.string(),
  consumedAt: v.optional(v.string()),
}

export const authTables = {
  users: defineTable(userFields)
    //
    .index("email", ["email"]),

  authAccounts: defineTable(authAccountFields)
    //
    .index("userIdAndProvider", ["userId", "provider"])
    .index("providerAndAccountId", ["provider", "providerAccountId"]),

  authSessions: defineTable(authSessionFields)
    //
    .index("userId", ["userId"]),

  authRateLimits: defineTable(authRateLimitFields)
    //
    .index("identifier", ["identifier"]),

  authUserEmailRegistrations: defineTable(authUserEmailRegistrationFields)
    //
    .index("emailCode", ["email", "code"]),

  authEmailLoginCodes: defineTable(authEmailLoginCodeFields)
    //
    .index("emailCode", ["email", "code"]),
} as const
