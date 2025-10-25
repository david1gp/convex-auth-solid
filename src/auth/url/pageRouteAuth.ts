import type { PageNameAuth, pageNameAuth } from "./pageNameAuth"

export type PageRouteAuth = keyof typeof pageNameAuth

export const pageRouteAuth = {
  signUp: "/sign-up",
  signUpConfirmEmail: "/sign-up-confirm-email",
  signIn: "/sign-in",
  signInEnterOtp: "/sign-in-enter-otp",
  signInError: "/sign-in-error",
  signedIn: "/signed-in",
} as const satisfies Record<PageNameAuth, string>

export function urlPageSignUp(email?: string) {
  return pageRouteAuth.signUp + (email ? "?email=" + email : "")
}

export function urlPageSignIn(email?: string) {
  return pageRouteAuth.signIn + (email ? "?email=" + email : "")
}
