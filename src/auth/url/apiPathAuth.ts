export type ApiRouteAuth = keyof typeof apiRouteAuth

export const apiRouteAuth = {
  signInViaGoogle: "signInViaGoogle",
  signInViaGithub: "signInViaGithub",
  signInViaMicrosoft: "signInViaMicrosoft",
  signInViaDev: "signInViaDev",
  signUp: "signUp",
  signUpConfirmEmail: "signUpConfirmEmail",
  signInViaPw: "signInViaPw",
  signInViaEmail: "signInViaEmail",
  signInViaEmailEnterOtp: "signInViaEmailEnterOtp",
  profileUpdate: "profileUpdate",
  passwordChange: "passwordChange",
  passwordChangeConfirm: "passwordChangeConfirm",
  emailChange: "emailChange",
  emailChangeConfirm: "emailChangeConfirm",
} as const

export const apiPathAuth = {
  signInViaGoogle: "/google",
  signInViaGithub: "/github",
  signInViaMicrosoft: "/microsoft",
  signInViaDev: "/dev",
  signUp: "/sign-up",
  signUpConfirmEmail: "/sign-up-confirm-email",
  signInViaPw: "/sign-in-via-pw",
  signInViaEmail: "/sign-in-via-email",
  signInViaEmailEnterOtp: "/sign-in-via-email-enter-otp",
  profileUpdate: "/profile-update",
  passwordChange: "/password-change",
  passwordChangeConfirm: "/password-change-confirm",
  emailChange: "/email-change",
  emailChangeConfirm: "/email-change-confirm",
} as const satisfies Record<ApiRouteAuth, string>
