import type { PageNameAuth } from "#src/auth/url/pageNameAuth.js"
import { pageRouteAuth } from "#src/auth/url/pageRouteAuth.js"
import type { RouteComponent, RouteObject } from "#ui/utils/RouteConfig"
import { lazy } from "solid-js"

const SignUpPage = lazy(() => import("#src/auth/ui/sign_up/SignUpPage.js").then((c) => ({ default: c.SignUpPage })))
const SignInPage = lazy(() => import("#src/auth/ui/sign_in/page/SignInPage.js").then((c) => ({ default: c.SignInPage })))
const SignInErrorPage = lazy(() =>
  import("#src/auth/ui/sign_in/error/SignInErrorPage.js").then((c) => ({ default: c.SignInErrorPage })),
)
const RegistrationConfirmEmailPage = lazy(() =>
  import("#src/auth/ui/sign_up/email/SignUpConfirmEmailPage.js").then((c) => ({ default: c.SignUpConfirmEmailPage })),
)
const SignInViaEmailEnterOtpPage = lazy(() =>
  import("#src/auth/ui/sign_in/via_email_enter_otp/SignInViaEmailEnterOtpPage.js").then((c) => ({
    default: c.SignInViaEmailEnterOtpPage,
  })),
)
const ViewUserProfilePage = lazy(() =>
  import("#src/auth/ui/profile/UserProfilePage.js").then((c) => ({
    default: c.UserProfilePage,
  })),
)
const UserProfileMePage = lazy(() =>
  import("#src/auth/ui/profile_me/UserProfileMePage.js").then((c) => ({ default: c.UserProfileMePage })),
)
const UserProfileMeEditPage = lazy(() =>
  import("#src/auth/ui/profile_me/UserProfileMeEditPage.js").then((c) => ({ default: c.UserProfileMeEditPage })),
)
const UserProfileMeChangePasswordPage = lazy(() =>
  import("#src/auth/ui/profile_me/UserProfileMeChangePasswordPage.js").then((c) => ({
    default: c.UserProfileMeChangePasswordPage,
  })),
)
const UserProfileMeChangeEmailPage = lazy(() =>
  import("#src/auth/ui/profile_me/UserProfileMeChangeEmailPage.js").then((c) => ({
    default: c.UserProfileMeChangeEmailPage,
  })),
)
const UserProfileMeImagePage = lazy(() =>
  import("#src/auth/ui/profile_me/UserProfileMeImagePage.js").then((c) => ({ default: c.UserProfileMeImagePage })),
)
const UserProfileMeDeletePage = lazy(() =>
  import("#src/auth/ui/profile_me/UserProfileMeDeletePage.js").then((c) => ({ default: c.UserProfileMeDeletePage })),
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
    userProfileMeImage: UserProfileMeImagePage,
    userProfileMeDelete: UserProfileMeDeletePage,
    userProfileView: ViewUserProfilePage,
  } as const satisfies Record<PageNameAuth, RouteComponent>
  return Object.entries(routeMapping).map(([routeKey, component]) => ({
    path: pageRouteAuth[routeKey as PageNameAuth],
    component,
  }))
}
