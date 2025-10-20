export type ApiRouteAuth = keyof typeof apiRouteAuth

export const apiRouteAuth = {
  signInViaGoogle: "signInViaGoogle",
  signInViaGithub: "signInViaGithub",
  signInViaDev: "signInViaDev",
  signUp: "signUp",
  signUpConfirmEmail: "signUpConfirmEmail",
  signInViaPw: "signInViaPw",
  signInViaEmail: "signInViaEmail",
  signInViaEmailEnterOtp: "signInViaEmailEnterOtp",
} as const

export const apiPathAuth = {
  signInViaGoogle: "/google",
  signInViaGithub: "/github",
  signInViaDev: "/dev",
  signUp: "/sign-up",
  signUpConfirmEmail: "/sign-up-confirm-email",
  signInViaPw: "/sign-in-via-pw",
  signInViaEmail: "/sign-in-via-email",
  signInViaEmailEnterOtp: "/sign-in-via-email-enter-otp",
} as const satisfies Record<ApiRouteAuth, string>
