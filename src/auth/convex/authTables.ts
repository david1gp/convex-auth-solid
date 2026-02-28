import { otpTableFields } from "@/auth/convex/otp/otpTableFields"
import { vIdUser } from "@/auth/convex/vIdUser"
import { loginMethodValidator } from "@/auth/model_field/loginMethodValidator"
import { userRoleValidator } from "@/auth/model_field/userRoleValidator"
import { fieldsConvexCreatedAtUpdatedAt } from "@/utils/data/fieldsConvexCreatedAtUpdatedAt"
import { fieldsConvexCreatedAtUpdatedAtDeletedAt } from "@/utils/data/fieldsConvexCreatedAtUpdatedAtDeletedAt"
import { defineTable } from "convex/server"
import { v } from "convex/values"

export const userFields = {
  // data
  name: v.string(),
  username: v.optional(v.string()),
  image: v.optional(v.string()),
  bio: v.optional(v.string()),
  url: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerifiedAt: v.optional(v.string()),
  hashedPassword: v.optional(v.string()),
  role: userRoleValidator,
  // meta times
  ...fieldsConvexCreatedAtUpdatedAtDeletedAt,
}

export const authAccountFields = {
  // ids
  userId: vIdUser,
  // data
  provider: v.string(),
  providerAccountId: v.string(),
  // meta times
  ...fieldsConvexCreatedAtUpdatedAt,
}

export const authSessionFields = {
  // ids
  userId: vIdUser,
  // data
  loginMethod: v.union(loginMethodValidator),
  token: v.string(),
  expiresAt: v.string(),
  // meta times
  ...fieldsConvexCreatedAtUpdatedAtDeletedAt,
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
  userId: vIdUser,
  code: v.string(),
  email: v.string(),
  // meta
  createdAt: v.string(),
  consumedAt: v.optional(v.string()),
}

export const authTables = {
  users: defineTable(userFields)
    //
    .index("email", ["email"])
    .index("username", ["username"]),

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

  authOtps: defineTable(otpTableFields)
    //
    .index("emailCode", ["email", "code"]),
} as const
