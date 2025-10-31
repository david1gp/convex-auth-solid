import * as v from "valibot"
import { inputMaxLength50, urlMaxLength } from "~ui/input/input/inputMaxLength"

export const stringSchema1to50 = v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(inputMaxLength50))

export const stringSchemaId = stringSchema1to50
export const stringSchemaName = stringSchema1to50

export const stringSchema0to5000 = v.pipe(v.string(), v.trim(), v.minLength(0), v.maxLength(5_000))
export const stringSchemaDescription = stringSchema0to5000

export const stringSchema0to100 = v.pipe(v.string(), v.trim(), v.minLength(0), v.maxLength(100))

export const stringSchema = stringSchema0to100

export const stringSchema0to500 = v.pipe(v.string(), v.trim(), v.minLength(0), v.maxLength(urlMaxLength))
export const stringSchemaUrl = stringSchema0to500
