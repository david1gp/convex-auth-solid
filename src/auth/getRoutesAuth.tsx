import { lazy } from "solid-js"
import type { PageNameAuth } from "~auth/url/pageNameAuth"
import { pageRouteAuth } from "~auth/url/pageRouteAuth"
import type { RouteObject } from "~ui/utils/ui/RouteConfig"

const SignUpPage = lazy(() => import("@/auth/SignUpPage").then((c) => ({ default: c.SignUpPage })))
const SignInPage = lazy(() => import("@/auth/SignInPage").then((c) => ({ default: c.SignInPage })))
const SignInErrorPage = lazy(() =>
  import("~auth/ui/sign_in/error/SignInErrorPage").then((c) => ({ default: c.SignInErrorPage })),
)
const SignedInPage = lazy(() => import("~auth/ui/sign_in/SignedInPage").then((c) => ({ default: c.SignedInPage })))
const RegistrationConfirmEmailPage = lazy(() =>
  import("~auth/ui/email/SignUpConfirmEmailPage").then((c) => ({ default: c.SignUpConfirmEmailPage })),
)
const SignInEnterOtpPage = lazy(() =>
  import("~auth/ui/email/SignInEnterOtpPage").then((c) => ({ default: c.SignInEnterOtpPage })),
)

export function getRoutesAuth(): RouteObject[] {
  const routeMapping = {
    signUp: SignUpPage,
    signUpConfirmEmail: RegistrationConfirmEmailPage,
    signIn: SignInPage,
    signInEnterOtp: SignInEnterOtpPage,
    signInError: SignInErrorPage,
    signedIn: SignedInPage,
  } as const satisfies Record<PageNameAuth, RouteObject["component"]>
  return Object.entries(routeMapping).map(([routeKey, component]) => ({
    path: pageRouteAuth[routeKey as PageNameAuth],
    component,
  }))
}
