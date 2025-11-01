import { passwordSchema } from "@/auth/model/passwordSchema"
import { emailSchema } from "@/utils/valibot/emailSchema"
import { stringSchemaName } from "@/utils/valibot/stringSchema"
import * as v from "valibot"

export type SignUpType = v.InferOutput<typeof signUpSchema>

export const signUpSchema = v.object({
  name: stringSchemaName,
  email: emailSchema,
  pw: passwordSchema,
})
