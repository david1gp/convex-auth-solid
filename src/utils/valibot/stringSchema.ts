import * as v from "valibot"
import { inputMaxLength25, inputMaxLength50, urlMaxLength } from "~ui/input/input/inputMaxLength"

export const stringSchema1to50 = v.pipe(v.string(), v.minLength(1), v.maxLength(inputMaxLength50))
export const stringSchema5to25 = v.pipe(v.string(), v.minLength(5), v.maxLength(inputMaxLength25))
export const stringSchema0to2000 = v.pipe(v.string(), v.minLength(5), v.maxLength(2000))
export const stringSchema0to500 = v.pipe(v.string(), v.minLength(5), v.maxLength(urlMaxLength))
