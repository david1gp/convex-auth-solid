import { language } from "#src/app/i18n/language.js"
import { languageGetText } from "#src/app/i18n/languageGetText.js"
import { languageSignal, languageSignalRegisterHandler } from "#src/app/i18n/languageSignal.js"
import { ttl } from "#src/app/i18n/ttl.js"
import { CheckSingle } from "#ui/input/check/CheckSingle"
import { CorvuPopoverIcon } from "#ui/interactive/popover/CorvuPopoverIcon"
import { classMerge } from "#ui/utils/classMerge"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"
import { mdiTranslateVariant } from "@mdi/js"
import { tbLanguageDescription } from "./i18n/tbLanguageDescription.js"
import { tbSelectLanguage } from "./i18n/tbSelectLanguage.js"

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
