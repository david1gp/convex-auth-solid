import { emailSchema, otpSchema } from "@/auth/model/emailSchema"
import * as v from "valibot"

export type SignUpConfirmEmailType = v.InferOutput<typeof signUpConfirmEmailSchema>

export const signUpConfirmEmailSchema = v.object({
  email: emailSchema,
  code: otpSchema,
})
