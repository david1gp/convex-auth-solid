export type AuthLegalAgreeVariant = keyof typeof authLegalAgreeVariant

export const authLegalAgreeVariant = {
  signUp: "signUp",
  signIn: "signIn",
} as const
