import * as a from "valibot"
import { valibotFieldToConvexValidator } from "#src/utils/convex/valibotToConvex.ts"

export type Language = keyof typeof language

export const language = {
  en: "en",
  ru: "ru",
  tj: "tj",
} as const

export const languageDefault: Language = language.en

export function isEn(l: Language): boolean {
  return l === language.en
}

export const languageSchema = a.enum(language)

export const languageValidator = valibotFieldToConvexValidator(languageSchema)

export function languageParseString<T>(s: string, fallback: T): Language | T {
  const parsed = a.safeParse(languageSchema, s)
  if (!parsed.success) return fallback
  return parsed.output
}

//
// languageOrNone
//

export type LanguageOrNone = keyof typeof languageOrNone

export const languageOrNone = {
  none: "none",
  ...language,
} as const

export const languageOrNoneSchema = a.enum(languageOrNone)

export const languageOrNoneValidator = valibotFieldToConvexValidator(languageOrNoneSchema)
