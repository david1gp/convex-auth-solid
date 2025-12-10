export type AuthLegalAgreeVariant = keyof typeof authLegalAgreeVariant

export const authLegalAgreeVariant = {
  explicit: "explicit",
  signUp: "signUp",
  signIn: "signIn",
} as const
