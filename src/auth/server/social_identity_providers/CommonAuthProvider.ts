import * as a from "valibot"
import { loginProvider, socialLoginProvider } from "#src/auth/model_field/socialLoginProvider.ts"
import { userRoleSchema } from "#src/auth/model_field/userRole.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { emailSchema } from "#src/utils/valibot/emailSchema.ts"

const commonAuthProviderDataSchema = {
  providerId: a.string(),
  givenName: a.string(),
  familyName: a.string(),
  image: a.string(),
  username: a.string(),
  email: a.optional(emailSchema),
} as const

const legacyAuthProviderSchema = a.object({
  provider: a.enum(socialLoginProvider),
  ...commonAuthProviderDataSchema,
})

const devAuthProviderSchema = a.object({
  provider: a.literal(loginProvider.dev),
  ...commonAuthProviderDataSchema,
})

const oidcAuthProviderSchema = a.object({
  provider: a.literal(loginProvider.oidc),
  issuer: a.pipe(a.string(), a.minLength(1)),
  ...commonAuthProviderDataSchema,
  role: a.optional(userRoleSchema),
})

const commonAuthProviderArgsFields = {
  provider: a.enum(loginProvider),
  issuer: a.optional(a.string()),
  role: a.optional(userRoleSchema),
  ...commonAuthProviderDataSchema,
} as const

export const commonAuthProviderSchema = a.union([
  legacyAuthProviderSchema,
  devAuthProviderSchema,
  oidcAuthProviderSchema,
])

export type CommonAuthProvider = a.InferOutput<typeof commonAuthProviderSchema>

export const commonAuthProviderValidator = valibotToConvex(commonAuthProviderArgsFields)

export function getUserNameFromCommonAuthProvider(
  user: Pick<CommonAuthProvider, "givenName" | "familyName" | "username" | "email">,
  ifMissing: string,
): string {
  if (user.givenName && user.familyName) return `${user.givenName} ${user.familyName}`
  if (user.givenName) return user.givenName
  if (user.familyName) return user.familyName
  if (user.username) return user.username
  if (user.email) return user.email
  return ifMissing
}
