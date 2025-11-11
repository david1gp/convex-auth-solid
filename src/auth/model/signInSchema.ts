import { passwordSchema } from "@/auth/model/passwordSchema"
import { emailSchema } from "@/utils/valibot/emailSchema"
import { inputMaxLength100 } from "@/utils/valibot/inputMaxLength"
import * as a from "valibot"

export type SignInViaPwType = a.InferOutput<typeof signInViaPwSchema>
export const signInViaPwSchema = a.object({
  email: emailSchema,
  pw: passwordSchema,
})

export type SignInViaEmailType = a.InferOutput<typeof signInViaEmailSchema>
export const signInViaEmailSchema = a.object({
  email: emailSchema,
})

export type SignInViaEmailEnterOtpType = a.InferOutput<typeof signInViaEmailEnterOtpSchema>
export const signInViaEmailEnterOtpSchema = a.object({
  email: a.pipe(a.string(), a.email(), a.maxLength(inputMaxLength100)),
  code: a.pipe(a.string(), a.length(6)),
})
