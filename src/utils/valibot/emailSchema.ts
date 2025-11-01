import { cantBeEmpty } from "@/utils/valibot/cantBeEmpty"
import * as v from "valibot"
import { inputMaxLength100 } from "~ui/input/input/inputMaxLength"

export const emailSchema = v.pipe(
  v.string(),
  v.nonEmpty(cantBeEmpty),
  v.maxLength(inputMaxLength100, "Only a max length of 100 is allowed"),
  v.email("The email is badly formatted"),
)
