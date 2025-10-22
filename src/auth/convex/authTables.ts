import { loginMethodValidator } from "@/auth/model/loginMethodValidator"
import { userRoleValidator } from "@/auth/model/userRoleValidator"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import { vIdUsers } from "./vIdUSers"

export const authTables = {
  users: defineTable({
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
  }).index("email", ["email"]),

  authAccounts: defineTable({
    // ids
    userId: vIdUsers,
    // data
    provider: v.string(),
    providerAccountId: v.string(),
    // meta times
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("userIdAndProvider", ["userId", "provider"])
    .index("providerAndAccountId", ["provider", "providerAccountId"]),

  authSessions: defineTable({
    // ids
    userId: vIdUsers,
    // data
    loginMethod: v.union(loginMethodValidator),
    token: v.string(),
    // meta times
    createdAt: v.string(),
    updatedAt: v.string(),
    expiresAt: v.string(),
    deletedAt: v.optional(v.string()),
  }).index("userId", ["userId"]),

  /**
   * Rate limits for OTP and password sign-in.
   */
  authRateLimits: defineTable({
    identifier: v.string(),
    attemptsLeft: v.number(),
    // meta times
    lastAttemptedAt: v.number(),
  }).index("identifier", ["identifier"]),

  authUserEmailRegistrations: defineTable({
    // data
    email: v.string(),
    code: v.string(),
    name: v.string(),
    hashedPassword: v.optional(v.string()),
    // meta
    createdAt: v.string(),
    consumedAt: v.optional(v.string()),
  }).index("emailCode", ["email", "code"]),

  authEmailLoginCodes: defineTable({
    // data
    userId: vIdUsers,
    code: v.string(),
    email: v.string(),
    // meta
    createdAt: v.string(),
    consumedAt: v.optional(v.string()),
  }).index("emailCode", ["email", "code"]),
} as const
