import * as a from "valibot"
import { valibotFieldToConvexValidator } from "#src/utils/convex/valibotToConvex.ts"

export type OtpPurpose = keyof typeof otpPurpose

export const otpPurpose = {
  signUp: "signUp",
  signIn: "signIn",
  emailChange: "emailChange",
  passwordChange: "passwordChange",
} as const

export const otpPurposeSchema = a.enum(otpPurpose)

export const otpPurposes: Readonly<OtpPurpose[]> = Object.values(otpPurpose)

export const otpPurposeValidator = valibotFieldToConvexValidator(otpPurposeSchema)

function types1(a: typeof otpPurposeValidator.type): OtpPurpose {
  return a
}
