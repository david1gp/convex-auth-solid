import { loginMethod, type LoginMethod } from "@/auth/model/loginMethod"
import { loginProvider, socialLoginProvider, type SocialLoginProvider } from "@/auth/model/socialLoginProvider"
import { v } from "convex/values"

export const loginMethodValidator = v.union(
  v.literal(loginMethod.email),
  v.literal(loginMethod.password),
  v.literal(loginMethod.google),
  v.literal(loginMethod.github),
  v.literal(loginMethod.dev),
)

function types1(a: typeof loginMethodValidator.type): LoginMethod {
  return a
}

export const socialLoginProviderValidator = v.union(
  v.literal(socialLoginProvider.google),
  v.literal(socialLoginProvider.github),
)

export const loginProviderValidator = v.union(
  v.literal(loginProvider.google),
  v.literal(loginProvider.github),
  v.literal(loginProvider.dev),
)

function types2(a: typeof socialLoginProviderValidator.type): SocialLoginProvider {
  return a
}
