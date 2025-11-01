import { passwordSchema } from "@/auth/model/passwordSchema"
import { emailSchema } from "@/utils/valibot/emailSchema"
import * as v from "valibot"
import { inputMaxLength50 } from "~ui/input/input/inputMaxLength"

export type SignInViaPwType = v.InferOutput<typeof signInViaPwSchema>
export const signInViaPwSchema = v.object({
  email: emailSchema,
  pw: passwordSchema,
})

export type SignInViaEmailType = v.InferOutput<typeof signInViaEmailSchema>
export const signInViaEmailSchema = v.object({
  email: emailSchema,
})

export type SignInViaEmailEnterOtpType = v.InferOutput<typeof signInViaEmailEnterOtpSchema>
export const signInViaEmailEnterOtpSchema = v.object({
  email: v.pipe(v.string(), v.email(), v.maxLength(inputMaxLength50)),
  code: v.pipe(v.string(), v.length(6)),
})
