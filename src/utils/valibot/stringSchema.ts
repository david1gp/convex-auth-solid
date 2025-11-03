import { cantBeEmpty } from "@/utils/valibot/cantBeEmpty"
import * as v from "valibot"
import { inputMaxLength100, inputMaxLength50 } from "~ui/input/input/inputMaxLength"

export const stringSchema1to50 = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty(cantBeEmpty),
  v.maxLength(inputMaxLength50, "Only a max length of 50 is allowed"),
)

export const stringSchemaId = stringSchema1to50
export const stringSchemaName = stringSchema1to50

export const stringSchema0to5000 = v.pipe(v.string(), v.trim(), v.maxLength(5_000))
export const stringSchemaDescription = stringSchema0to5000

export const stringSchema0to100 = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty(cantBeEmpty),
  v.maxLength(inputMaxLength100, "Only a max length of 100 is allowed"),
)

export const stringSchema = stringSchema0to100

export const stringSchema0to500 = v.pipe(
  v.string(),
  v.trim(),
  v.maxLength(inputMaxLength100, "Only a max length of 500 is allowed"),
)
export const stringSchemaUrl = stringSchema0to500
