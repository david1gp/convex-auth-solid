import type { PageNameAuth } from "@/auth/url/pageNameAuth"
import { pageRouteAuth } from "@/auth/url/pageRouteAuth"
import { lazy } from "solid-js"
import type { RouteObject } from "~ui/utils/RouteConfig"

const SignUpPage = lazy(() => import("@/auth/ui/sign_up/SignUpPage").then((c) => ({ default: c.SignUpPage })))
const SignInPage = lazy(() => import("@/auth/ui/sign_in/page/SignInPage").then((c) => ({ default: c.SignInPage })))
const SignInErrorPage = lazy(() =>
  import("@/auth/ui/sign_in/error/SignInErrorPage").then((c) => ({ default: c.SignInErrorPage })),
)
const RegistrationConfirmEmailPage = lazy(() =>
  import("@/auth/ui/sign_up/email/SignUpConfirmEmailPage").then((c) => ({ default: c.SignUpConfirmEmailPage })),
)
const SignInViaEmailEnterOtpPage = lazy(() =>
  import("@/auth/ui/sign_in/via_email_enter_otp/SignInViaEmailEnterOtpPage").then((c) => ({
    default: c.SignInViaEmailEnterOtpPage,
  })),
)

export function getRoutesAuth(): RouteObject[] {
  const routeMapping = {
    signUp: SignUpPage,
    signUpConfirmEmail: RegistrationConfirmEmailPage,
    signIn: SignInPage,
    signInEnterOtp: SignInViaEmailEnterOtpPage,
    signInError: SignInErrorPage,
  } as const satisfies Record<PageNameAuth, RouteObject["component"]>
  return Object.entries(routeMapping).map(([routeKey, component]) => ({
    path: pageRouteAuth[routeKey as PageNameAuth],
    component,
  }))
}
