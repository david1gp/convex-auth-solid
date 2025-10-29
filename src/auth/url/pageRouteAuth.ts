import { serializeUrlParams } from "~utils/url/serializeUrlParams"
import type { PageNameAuth, pageNameAuth } from "./pageNameAuth"

export type PageRouteAuth = keyof typeof pageNameAuth

export const pageRouteAuth = {
  signUp: "/sign-up",
  signUpConfirmEmail: "/sign-up-confirm-email",
  signIn: "/sign-in",
  signInEnterOtp: "/sign-in-enter-otp",
  signInError: "/sign-in-error",
} as const satisfies Record<PageNameAuth, string>

export function urlPageSignUp(email?: string, returnUrl?: string) {
  return pageRouteAuth.signUp + "?" + serializeSearchParams(email, returnUrl)
}

export function urlPageSignIn(email?: string, returnUrl?: string) {
  return pageRouteAuth.signIn + "?" + serializeSearchParams(email, returnUrl)
}

function serializeSearchParams(email?: string, returnUrl?: string) {
  const obj: Record<string, string> = {}
  if (email) {
    obj.email = email
  }
  if (returnUrl) {
    obj.returnUrl = returnUrl
  }
  return serializeUrlParams(obj)
}
