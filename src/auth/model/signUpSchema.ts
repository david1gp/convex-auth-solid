import { languageSchema } from "#src/app/i18n/language.js"
import { passwordSchema } from "#src/auth/model_field/passwordSchema.js"
import { emailSchema } from "#src/utils/valibot/emailSchema.js"
import { stringSchemaName } from "#src/utils/valibot/stringSchema.js"
import * as a from "valibot"

export type SignUpType = a.InferOutput<typeof signUpSchema>

export const signUpSchema = a.object({
  name: stringSchemaName,
  email: emailSchema,
  pw: passwordSchema,
  l: languageSchema,
})
