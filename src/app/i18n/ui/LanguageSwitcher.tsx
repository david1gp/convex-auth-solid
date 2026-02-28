import { language, type Language } from "@/app/i18n/language"
import { languageSignal, languageSignalRegisterHandler } from "@/app/i18n/languageSignal"
import { languageGetText } from "@/app/i18n/languageGetText"
import { ttl } from "@/app/i18n/ttl"
import { mdiTranslateVariant } from "@mdi/js"
import { CheckSingle } from "~ui/input/check/CheckSingle"
import { CorvuPopoverIcon } from "~ui/interactive/popover/CorvuPopoverIcon"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { tbLanguageDescription } from "./i18n/tbLanguageDescription"
import { tbSelectLanguage } from "./i18n/tbSelectLanguage"

export interface LanguageSwitcherProps extends MayHaveClass {
  icon?: string
  title?: string
}

export function LanguageSwitcher(p: LanguageSwitcherProps) {
  languageSignalRegisterHandler()
  return (
    <CorvuPopoverIcon
      icon={p.icon ?? mdiTranslateVariant}
      variant="ghost"
      title={p.title ?? ttl(tbSelectLanguage)}
      class={classMerge("text-muted-foreground", p.class)}
      innerClass="flex flex-col gap-3 min-w-48"
    >
      <div class="">
        <h3 class="text-lg font-medium">{ttl(tbSelectLanguage)}</h3>
        <p class="text-sm text-muted-foreground">{ttl(tbLanguageDescription)}</p>
      </div>
      <CheckSingle
        valueSignal={languageSignal}
        getOptions={() => Object.values(language)}
        valueText={languageGetText}
        innerClass="flex flex-col gap-1"
        optionClass="hover:bg-gray-50 dark:hover:bg-gray-800 rounded p-2"
        disallowDeselection={true}
      />
    </CorvuPopoverIcon>
  )
}
