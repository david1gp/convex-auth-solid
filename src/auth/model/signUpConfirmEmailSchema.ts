import { otpSchema } from "@/auth/model/otpSchema"
import { emailSchema } from "@/utils/valibot/emailSchema"
import * as v from "valibot"

export type SignUpConfirmEmailType = v.InferOutput<typeof signUpConfirmEmailSchema>

export const signUpConfirmEmailSchema = v.object({
  email: emailSchema,
  code: otpSchema,
})
