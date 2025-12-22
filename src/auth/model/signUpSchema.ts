import { passwordSchema } from "@/auth/model_field/passwordSchema"
import { emailSchema } from "@/utils/valibot/emailSchema"
import { stringSchema, stringSchemaName } from "@/utils/valibot/stringSchema"
import * as a from "valibot"

export type SignUpType = a.InferOutput<typeof signUpSchema>

export const signUpSchema = a.object({
  name: stringSchemaName,
  email: emailSchema,
  pw: passwordSchema,
  l: stringSchema,
})
