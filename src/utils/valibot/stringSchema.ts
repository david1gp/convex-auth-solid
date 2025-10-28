import * as v from "valibot"
import { inputMaxLength25, inputMaxLength50, urlMaxLength } from "~ui/input/input/inputMaxLength"

export const string1to50Schema = v.pipe(v.string(), v.minLength(1), v.maxLength(inputMaxLength50))
export const string5to25Schema = v.pipe(v.string(), v.minLength(5), v.maxLength(inputMaxLength25))
export const string0to2000Schema = v.pipe(v.string(), v.minLength(5), v.maxLength(2000))
export const string0to500Schema = v.pipe(v.string(), v.minLength(5), v.maxLength(urlMaxLength))
