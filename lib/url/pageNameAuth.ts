
export type PageNameAuth = keyof typeof pageNameAuth

export const pageNameAuth = {
  signUp: "signUp",
  signUpConfirmEmail: "signUpConfirmEmail",
  signIn: "signIn",
  signInEnterOtp: "signInEnterOtp",
  signInError: "signInError",
  signedIn: "signedIn",
} as const
