import type { PageNameAuth } from "#src/auth/url/pageNameAuth.ts"
import { pageRouteAuth } from "#src/auth/url/pageRouteAuth.ts"
import type { RouteComponent, RouteObject } from "#ui/utils/RouteConfig.ts"
import { lazy } from "solid-js"

const SignUpPage = lazy(() => import("#src/auth/ui/sign_up/SignUpPage.tsx").then((c) => ({ default: c.SignUpPage })))
const SignInPage = lazy(() => import("#src/auth/ui/sign_in/page/SignInPage.tsx").then((c) => ({ default: c.SignInPage })))
const SignInErrorPage = lazy(() =>
  import("#src/auth/ui/sign_in/error/SignInErrorPage.tsx").then((c) => ({ default: c.SignInErrorPage })),
)
const RegistrationConfirmEmailPage = lazy(() =>
  import("#src/auth/ui/sign_up/email/SignUpConfirmEmailPage.tsx").then((c) => ({ default: c.SignUpConfirmEmailPage })),
)
const SignInViaEmailEnterOtpPage = lazy(() =>
  import("#src/auth/ui/sign_in/via_email_enter_otp/SignInViaEmailEnterOtpPage.tsx").then((c) => ({
    default: c.SignInViaEmailEnterOtpPage,
  })),
)
const ViewUserProfilePage = lazy(() =>
  import("#src/auth/ui/profile/UserProfilePage.tsx").then((c) => ({
    default: c.UserProfilePage,
  })),
)
const UserProfileMePage = lazy(() =>
  import("#src/auth/ui/profile_me/UserProfileMePage.tsx").then((c) => ({ default: c.UserProfileMePage })),
)
const UserProfileMeEditPage = lazy(() =>
  import("#src/auth/ui/profile_me/UserProfileMeEditPage.tsx").then((c) => ({ default: c.UserProfileMeEditPage })),
)
const UserProfileMeChangePasswordPage = lazy(() =>
  import("#src/auth/ui/profile_me/UserProfileMeChangePasswordPage.tsx").then((c) => ({
    default: c.UserProfileMeChangePasswordPage,
  })),
)
const UserProfileMeChangeEmailPage = lazy(() =>
  import("#src/auth/ui/profile_me/UserProfileMeChangeEmailPage.tsx").then((c) => ({
    default: c.UserProfileMeChangeEmailPage,
  })),
)
const UserProfileMeImagePage = lazy(() =>
  import("#src/auth/ui/profile_me/UserProfileMeImagePage.tsx").then((c) => ({ default: c.UserProfileMeImagePage })),
)
const UserProfileMeDeletePage = lazy(() =>
  import("#src/auth/ui/profile_me/UserProfileMeDeletePage.tsx").then((c) => ({ default: c.UserProfileMeDeletePage })),
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
