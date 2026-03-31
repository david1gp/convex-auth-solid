import { languageSchema } from "#src/app/i18n/language.ts"
import { passwordSchema } from "#src/auth/model_field/passwordSchema.ts"
import { emailSchema } from "#src/utils/valibot/emailSchema.ts"
import { stringSchemaName } from "#src/utils/valibot/stringSchema.ts"
import * as a from "valibot"

export type SignUpType = a.InferOutput<typeof signUpSchema>

export const signUpSchema = a.object({
  name: stringSchemaName,
  email: emailSchema,
  pw: passwordSchema,
  l: languageSchema,
})
