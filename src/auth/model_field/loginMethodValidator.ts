import { loginMethod, type LoginMethod } from "@/auth/model_field/loginMethod"
import { loginProvider, socialLoginProvider, type SocialLoginProvider } from "@/auth/model_field/socialLoginProvider"
import { v } from "convex/values"

export const loginMethodValidator = v.union(
  v.literal(loginMethod.email),
  v.literal(loginMethod.password),
  v.literal(loginMethod.google),
  v.literal(loginMethod.github),
  v.literal(loginMethod.microsoft),
  v.literal(loginMethod.dev),
)

function types1(a: typeof loginMethodValidator.type): LoginMethod {
  return a
}
function types1a(a: LoginMethod): typeof loginMethodValidator.type {
  return a
}

export const socialLoginProviderValidator = v.union(
  v.literal(socialLoginProvider.google),
  v.literal(socialLoginProvider.github),
  v.literal(socialLoginProvider.microsoft),
)

export const loginProviderValidator = v.union(
  v.literal(loginProvider.google),
  v.literal(loginProvider.github),
  v.literal(loginProvider.microsoft),
  v.literal(loginProvider.dev),
)

function types2(a: typeof socialLoginProviderValidator.type): SocialLoginProvider {
  return a
}
function types2a(a: SocialLoginProvider): typeof socialLoginProviderValidator.type {
  return a
}
