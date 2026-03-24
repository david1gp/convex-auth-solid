import { cantBeEmpty } from "#src/utils/valibot/cantBeEmpty.js"
import { inputMaxLengthUrl } from "#src/utils/valibot/inputMaxLength.js"
import * as a from "valibot"

export const requiredPasswordLength = 12

export const passwordSchema = a.pipe(
  a.string(),
  a.nonEmpty(cantBeEmpty),
  a.minLength(requiredPasswordLength, "Password is to short"),
  a.maxLength(inputMaxLengthUrl),
)
