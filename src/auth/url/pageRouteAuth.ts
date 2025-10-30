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

export function urlPageSignUp(email?: string, returnPath?: string) {
  return pageRouteAuth.signUp + "?" + serializeSearchParams(email, returnPath)
}

export function urlPageSignIn(email?: string, returnPath?: string) {
  return pageRouteAuth.signIn + "?" + serializeSearchParams(email, returnPath)
}

function serializeSearchParams(email?: string, returnPath?: string) {
  const obj: Record<string, string> = {}
  if (email) {
    obj.email = email
  }
  if (returnPath) {
    obj.returnPath = returnPath
  }
  return serializeUrlParams(obj)
}
