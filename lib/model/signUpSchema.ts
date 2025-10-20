import * as v from "valibot"
import { emailSchema, passwordSchema, signUpNameSchema } from "~auth/model/emailSchema"

export type SignUpType = v.InferOutput<typeof signUpSchema>

export const signUpSchema = v.object({
  name: signUpNameSchema,
  email: emailSchema,
  pw: v.optional(passwordSchema),
})
