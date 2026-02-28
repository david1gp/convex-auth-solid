import { cantBeEmpty } from "@/utils/valibot/cantBeEmpty"
import { inputMaxLengthUrl } from "@/utils/valibot/inputMaxLength"
import * as a from "valibot"

export const requiredPasswordLength = 12

export const passwordSchema = a.pipe(
  a.string(),
  a.nonEmpty(cantBeEmpty),
  a.minLength(requiredPasswordLength, "Password is to short"),
  a.maxLength(inputMaxLengthUrl),
)
