import { defineTable } from "convex/server"
import * as a from "valibot"
import { vIdUser } from "#src/auth/convex/vIdUser.ts"
import { userDataSchemaFields } from "#src/auth/model/userDataSchemaFields.ts"
import { loginMethodSchema } from "#src/auth/model_field/loginMethod.ts"
import { otpPurposeSchema } from "#src/auth/model_field/otpPurpose.ts"
import { otpSchema } from "#src/auth/model_field/otpSchema.ts"
import { loginProviderSchema } from "#src/auth/model_field/socialLoginProvider.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.ts"
import { fieldsSchemaCreatedAtUpdatedAtDeletedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAtDeletedAt.ts"
import { emailSchema } from "#src/utils/valibot/emailSchema.ts"
import { tokenSchema } from "#src/utils/valibot/tokenSchema.ts"
import { dateTimeSchema } from "#utils/valibot/dateTimeSchema.js"

const authUserDataSchemaFields = {
  ...userDataSchemaFields,
  hashedPassword: a.optional(a.string()),
} as const

const authAccountDataSchemaFields = {
  provider: loginProviderSchema,
  issuer: a.optional(a.string()),
  providerAccountId: a.string(),
} as const

const authSessionDataSchemaFields = {
  loginMethod: loginMethodSchema,
  token: tokenSchema,
  expiresAt: dateTimeSchema,
} as const

const authRateLimitDataSchemaFields = {
  identifier: a.string(),
  attemptsLeft: a.number(),
  lastAttemptedAt: a.number(),
} as const

const authUserEmailRegistrationDataSchemaFields = {
  email: emailSchema,
  code: otpSchema,
  name: userDataSchemaFields.name,
  hashedPassword: a.optional(a.string()),
  createdAt: dateTimeSchema,
  consumedAt: a.optional(dateTimeSchema),
} as const

const authEmailLoginCodeDataSchemaFields = {
  code: otpSchema,
  email: emailSchema,
  createdAt: dateTimeSchema,
  consumedAt: a.optional(dateTimeSchema),
} as const

const authOtpDataSchemaFields = {
  name: a.string(),
  email: emailSchema,
  code: otpSchema,
  purpose: otpPurposeSchema,
  createdAt: dateTimeSchema,
  consumedAt: a.optional(dateTimeSchema),
} as const

export const authTables = {
  users: defineTable({
    ...valibotToConvex(authUserDataSchemaFields),
    ...valibotToConvex(fieldsSchemaCreatedAtUpdatedAtDeletedAt),
  })
    //
    .index("email", ["email"])
    .index("username", ["username"]),

  authAccounts: defineTable({
    userId: vIdUser,
    ...valibotToConvex(authAccountDataSchemaFields),
    ...valibotToConvex(fieldsSchemaCreatedAtUpdatedAt),
  })
    //
    .index("userIdAndProvider", ["userId", "provider"])
    .index("providerAndAccountId", ["provider", "providerAccountId"])
    .index("providerIssuerAndAccountId", ["provider", "issuer", "providerAccountId"]),

  authSessions: defineTable({
    userId: vIdUser,
    ...valibotToConvex(authSessionDataSchemaFields),
    ...valibotToConvex(fieldsSchemaCreatedAtUpdatedAtDeletedAt),
  })
    //
    .index("userId", ["userId"]),

  authRateLimits: defineTable({
    ...valibotToConvex(authRateLimitDataSchemaFields),
  })
    //
    .index("identifier", ["identifier"]),

  authUserEmailRegistrations: defineTable({
    ...valibotToConvex(authUserEmailRegistrationDataSchemaFields),
  })
    //
    .index("emailCode", ["email", "code"]),

  authEmailLoginCodes: defineTable({
    userId: vIdUser,
    ...valibotToConvex(authEmailLoginCodeDataSchemaFields),
  })
    //
    .index("emailCode", ["email", "code"]),

  authOtps: defineTable({
    userId: vIdUser,
    ...valibotToConvex(authOtpDataSchemaFields),
  })
    //
    .index("emailCode", ["email", "code"]),
} as const
