import { otpSchema } from "#src/auth/model_field/otpSchema.ts"
import { emailSchema } from "#src/utils/valibot/emailSchema.ts"
import * as a from "valibot"

export type SignUpConfirmEmailType = a.InferOutput<typeof signUpConfirmEmailSchema>

export const signUpConfirmEmailSchema = a.object({
  email: emailSchema,
  code: otpSchema,
})
