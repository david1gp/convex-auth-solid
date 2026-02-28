import type { Language, LanguageOrNone } from "@/app/i18n/language"
import { language, languageOrNone } from "@/app/i18n/language"
import { ttc } from "./ttc"

export function languageGetText(l: string) {
  switch (l as Language) {
    case language.en:
      return "English"
    case language.ru:
      return "Русский"
    case language.tj:
      return "Тоҷикӣ"
  }
}

export function languageOrNoneGetText(l: string) {
  switch (l as LanguageOrNone) {
    case languageOrNone.none:
      return ttc("None")
    default:
      return languageGetText(l)
  }
}
