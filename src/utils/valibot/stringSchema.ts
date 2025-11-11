import { cantBeEmpty } from "@/utils/valibot/cantBeEmpty"
import { inputMaxLength100, inputMaxLength50 } from "@/utils/valibot/inputMaxLength"
import * as a from "valibot"

export const stringSchema1to50 = a.pipe(
  a.string(),
  a.trim(),
  a.nonEmpty(cantBeEmpty),
  a.maxLength(inputMaxLength50, "Only a max length of 50 is allowed"),
)

export const stringSchemaId = stringSchema1to50
export const stringSchemaName = stringSchema1to50

export const stringSchema0to5000 = a.pipe(a.string(), a.trim(), a.maxLength(5_000))
export const stringSchemaDescription = stringSchema0to5000

export const stringSchema0to100 = a.pipe(
  a.string(),
  a.trim(),
  a.nonEmpty(cantBeEmpty),
  a.maxLength(inputMaxLength100, "Only a max length of 100 is allowed"),
)

export const stringSchema = stringSchema0to100

export const stringSchema0to500 = a.pipe(
  a.string(),
  a.trim(),
  a.maxLength(inputMaxLength100, "Only a max length of 500 is allowed"),
)
export const stringSchemaUrl = stringSchema0to500
