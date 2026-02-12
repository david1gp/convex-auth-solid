import type { PageNameAuth } from "@/auth/url/pageNameAuth"
import { pageRouteAuth } from "@/auth/url/pageRouteAuth"
import { lazy } from "solid-js"
import type { RouteComponent, RouteObject } from "~ui/utils/RouteConfig"

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
const ViewUserProfilePage = lazy(() =>
  import("@/auth/ui/profile/UserProfilePage").then((c) => ({
    default: c.UserProfilePage,
  })),
)
const UserProfileMePage = lazy(() =>
  import("@/auth/ui/profile_me/UserProfileMePage").then((c) => ({
    default: c.UserProfileMePage,
  })),
)
const UserProfileMeEditPage = lazy(() =>
  import("@/auth/ui/profile_me/UserProfileMeEditPage").then((c) => ({
    default: c.UserProfileMeEditPage,
  })),
)
const UserProfileMeChangePasswordPage = lazy(() =>
  import("@/auth/ui/profile_me/UserProfileMeChangePasswordPage").then((c) => ({
    default: c.UserProfileMeChangePasswordPage,
  })),
)
const UserProfileMeChangeEmailPage = lazy(() =>
  import("@/auth/ui/profile_me/UserProfileMeChangeEmailPage").then((c) => ({
    default: c.UserProfileMeChangeEmailPage,
  })),
)

export function getRoutesAuth(): RouteObject[] {
  const routeMapping = {
    signUp: SignUpPage,
    signUpConfirmEmail: RegistrationConfirmEmailPage,
    signIn: SignInPage,
    signInEnterOtp: SignInViaEmailEnterOtpPage,
    signInError: SignInErrorPage,
    userProfileMe: UserProfileMePage,
    userProfileMeEdit: UserProfileMeEditPage,
    userProfileMeChangePassword: UserProfileMeChangePasswordPage,
    userProfileMeChangeEmail: UserProfileMeChangeEmailPage,
    userProfileMeImage: UserProfileMePage,
    userProfileView: ViewUserProfilePage,
  } as const satisfies Record<PageNameAuth, RouteComponent>
  return Object.entries(routeMapping).map(([routeKey, component]) => ({
    path: pageRouteAuth[routeKey as PageNameAuth],
    component,
  }))
}
