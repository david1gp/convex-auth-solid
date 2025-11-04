import { cantBeEmpty } from "@/utils/valibot/cantBeEmpty"
import { inputMaxLength100 } from "@/utils/valibot/inputMaxLength"
import * as v from "valibot"

export const emailSchema = v.pipe(
  v.string(),
  v.nonEmpty(cantBeEmpty),
  v.maxLength(inputMaxLength100, "Only a max length of 100 is allowed"),
  v.email("The email is badly formatted"),
)
