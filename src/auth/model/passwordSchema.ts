import { requiredPasswordLength } from "@/auth/model/requiredPasswordLength"
import { cantBeEmpty } from "@/utils/valibot/cantBeEmpty"
import { urlMaxLength } from "@/utils/valibot/inputMaxLength"
import * as v from "valibot"

export const passwordSchema = v.pipe(
  v.string(),
  v.nonEmpty(cantBeEmpty),
  v.minLength(requiredPasswordLength, "Password is to short"),
  v.maxLength(urlMaxLength),
)
