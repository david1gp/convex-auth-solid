import { otpSchema } from "@/auth/model_field/otpSchema"
import { emailSchema } from "@/utils/valibot/emailSchema"
import * as a from "valibot"

export type SignUpConfirmEmailType = a.InferOutput<typeof signUpConfirmEmailSchema>

export const signUpConfirmEmailSchema = a.object({
  email: emailSchema,
  code: otpSchema,
})
