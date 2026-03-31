import type { TranslationBlock } from "#src/app/i18n/TranslationBlock.ts"

export const tbIsRequired = {
  en: "Is required",
  de: "Pflichtfeld",
  ru: "Обязательно",
  tj: "Маҷбури аст",
} as const satisfies TranslationBlock
