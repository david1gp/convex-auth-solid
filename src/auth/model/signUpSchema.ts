import { emailSchema, passwordSchema, signUpNameSchema } from "@/auth/model/emailSchema"
import * as v from "valibot"

export type SignUpType = v.InferOutput<typeof signUpSchema>

export const signUpSchema = v.object({
  name: signUpNameSchema,
  email: emailSchema,
  pw: passwordSchema,
})
