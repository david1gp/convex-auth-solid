import * as v from "valibot"

export type SocialLoginProvider = keyof typeof socialLoginProvider

export const socialLoginProvider = {
  google: "google",
  github: "github",
  // auth0: "auth0",
} as const

export const socialLoginProviderSchema = v.enum(socialLoginProvider)

export const socialLoginProviders: Readonly<SocialLoginProvider[]> = Object.values(socialLoginProvider)

export type LoginProvider = keyof typeof loginProvider

export const loginProvider = {
  ...socialLoginProvider,
  dev: "dev",
} as const

export const loginProviderSchema = v.enum(loginProvider)

export const loginProviders: Readonly<LoginProvider[]> = Object.values(loginProvider)
