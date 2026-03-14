import { vIdUser } from "@/auth/convex/vIdUser"
import { loginMethodValidator } from "@/auth/model_field/loginMethodValidator"
import { otpPurposeValidator } from "@/auth/model_field/otpPurpose"
import { userRoleValidator } from "@/auth/model_field/userRoleValidator"
import { fieldsConvexCreatedAtUpdatedAt } from "@/utils/data/fieldsConvexCreatedAtUpdatedAt"
import { fieldsConvexCreatedAtUpdatedAtDeletedAt } from "@/utils/data/fieldsConvexCreatedAtUpdatedAtDeletedAt"
import { defineTable } from "convex/server"
import { v } from "convex/values"

export const authTables = {
  users: defineTable({
    name: v.string(),
    username: v.optional(v.string()),
    image: v.optional(v.string()),
    bio: v.optional(v.string()),
    url: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerifiedAt: v.optional(v.string()),
    hashedPassword: v.optional(v.string()),
    role: userRoleValidator,
    ...fieldsConvexCreatedAtUpdatedAtDeletedAt,
  })
    //
    .index("email", ["email"])
    .index("username", ["username"]),

  authAccounts: defineTable({
    userId: vIdUser,
    provider: v.string(),
    providerAccountId: v.string(),
    ...fieldsConvexCreatedAtUpdatedAt,
  })
    //
    .index("userIdAndProvider", ["userId", "provider"])
    .index("providerAndAccountId", ["provider", "providerAccountId"]),

  authSessions: defineTable({
    userId: vIdUser,
    loginMethod: v.union(loginMethodValidator),
    token: v.string(),
    expiresAt: v.string(),
    ...fieldsConvexCreatedAtUpdatedAtDeletedAt,
  })
    //
    .index("userId", ["userId"]),

  authRateLimits: defineTable({
    identifier: v.string(),
    attemptsLeft: v.number(),
    lastAttemptedAt: v.number(),
  })
    //
    .index("identifier", ["identifier"]),

  authUserEmailRegistrations: defineTable({
    email: v.string(),
    code: v.string(),
    name: v.string(),
    hashedPassword: v.optional(v.string()),
    createdAt: v.string(),
    consumedAt: v.optional(v.string()),
  })
    //
    .index("emailCode", ["email", "code"]),

  authEmailLoginCodes: defineTable({
    userId: vIdUser,
    code: v.string(),
    email: v.string(),
    createdAt: v.string(),
    consumedAt: v.optional(v.string()),
  })
    //
    .index("emailCode", ["email", "code"]),

  authOtps: defineTable({
    userId: vIdUser,
    name: v.string(),
    email: v.string(),
    code: v.string(),
    purpose: otpPurposeValidator,
    createdAt: v.string(),
    consumedAt: v.optional(v.string()),
  })
    //
    .index("emailCode", ["email", "code"]),
} as const
