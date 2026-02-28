import { ttc } from "@/app/i18n/ttc"

export type AuthLegalAgreeVariant = keyof typeof authLegalAgreeVariant

export const authLegalAgreeVariant = {
  signUp: "signUp",
  signIn: "signIn",
} as const

export function authLegalAgreeText(v: AuthLegalAgreeVariant) {
  switch (v) {
    case authLegalAgreeVariant.signUp:
      return ttc("I agree to the")
    case authLegalAgreeVariant.signIn:
      return ttc("By signing in, I agree to the")
  }
}
