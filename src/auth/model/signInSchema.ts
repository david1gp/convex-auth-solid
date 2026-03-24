import { languageSchema } from "#src/app/i18n/language.js"
import { passwordSchema } from "#src/auth/model_field/passwordSchema.js"
import { emailSchema } from "#src/utils/valibot/emailSchema.js"
import { inputMaxLength100 } from "#src/utils/valibot/inputMaxLength.js"
import * as a from "valibot"

export type SignInViaPwType = a.InferOutput<typeof signInViaPwSchema>
export const signInViaPwSchema = a.object({
  email: emailSchema,
  pw: passwordSchema,
  l: languageSchema,
})

export type SignInViaEmailType = a.InferOutput<typeof signInViaEmailSchema>
export const signInViaEmailSchema = a.object({
  email: emailSchema,
  l: languageSchema,
})

export type SignInViaEmailEnterOtpType = a.InferOutput<typeof signInViaEmailEnterOtpSchema>
export const signInViaEmailEnterOtpSchema = a.object({
  email: a.pipe(a.string(), a.email(), a.maxLength(inputMaxLength100)),
  code: a.pipe(a.string(), a.length(6)),
  l: languageSchema,
})
