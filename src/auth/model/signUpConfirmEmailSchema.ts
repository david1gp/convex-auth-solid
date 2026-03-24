import { otpSchema } from "#src/auth/model_field/otpSchema.js"
import { emailSchema } from "#src/utils/valibot/emailSchema.js"
import * as a from "valibot"

export type SignUpConfirmEmailType = a.InferOutput<typeof signUpConfirmEmailSchema>

export const signUpConfirmEmailSchema = a.object({
  email: emailSchema,
  code: otpSchema,
})
