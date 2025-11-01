import { requiredPasswordLength } from "@/auth/model/requiredPasswordLength"
import { cantBeEmpty } from "@/utils/valibot/cantBeEmpty"
import * as v from "valibot"
import { urlMaxLength } from "~ui/input/input/inputMaxLength"

export const passwordSchema = v.pipe(
  v.string(),
  v.nonEmpty(cantBeEmpty),
  v.minLength(requiredPasswordLength, "Password is to short"),
  v.maxLength(urlMaxLength),
)
