import * as v from "valibot"
import { emailSchema, otpSchema } from "~auth/model/emailSchema"

export type SignUpConfirmEmailType = v.InferOutput<typeof signUpConfirmEmailSchema>

export const signUpConfirmEmailSchema = v.object({
  email: emailSchema,
  code: otpSchema,
})
