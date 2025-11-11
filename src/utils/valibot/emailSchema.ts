import { cantBeEmpty } from "@/utils/valibot/cantBeEmpty"
import { inputMaxLength100 } from "@/utils/valibot/inputMaxLength"
import * as a from "valibot"

export const emailSchema = a.pipe(
  a.string(),
  a.nonEmpty(cantBeEmpty),
  a.maxLength(inputMaxLength100, "Only a max length of 100 is allowed"),
  a.email("The email is badly formatted"),
)
