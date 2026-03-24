import type { Language } from "#src/app/i18n/language.js"
import { languageGetText } from "#src/app/i18n/languageGetText.js"
import { visibility, type Visibility } from "#src/resource/model_field/visibility.js"
import { visibilityGetText } from "#src/resource/model_field/visibilityGetText.js"
import { BadgeSoft } from "#src/ui/badge/BadgeSoft.jsx"
import { Icon } from "#ui/static/icon/Icon.jsx"
import { classMerge } from "#ui/utils/classMerge.js"
import type { MayHaveChildren } from "#ui/utils/MayHaveChildren.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import { mdiEye, mdiEyeOff, mdiTranslateVariant } from "@mdi/js"
import { Show } from "solid-js"

export interface MetaSectionTechnicalProps extends MayHaveClass, MayHaveChildren {
  visibility?: Visibility
  language?: Language
}

export function MetaSectionDisplay(p: MetaSectionTechnicalProps) {
  return (
    <div class={classMerge("flex flex-wrap gap-4", p.class)}>
      <Show when={p.visibility}>{(getVisibility) => <VisibilityBadge visibility={getVisibility()} />}</Show>
      <Show when={p.language}>{(getLanguage) => <LanguageBadge language={getLanguage()} />}</Show>
      {p.children}
    </div>
  )
}

interface VisibilityBadgeProps extends MayHaveClass {
  visibility: Visibility
}

function VisibilityBadge(p: VisibilityBadgeProps) {
  const v = p.visibility
  const text = visibilityGetText(v)
  return (
    <BadgeSoft>
      <Icon path={v === visibility.public ? mdiEye : mdiEyeOff} />
      <span>{text}</span>
    </BadgeSoft>
  )
}

interface LanguageBadgeProps extends MayHaveClass {
  language: Language
}

function LanguageBadge(p: LanguageBadgeProps) {
  const l = p.language
  const text = languageGetText(l)
  return (
    <BadgeSoft>
      <Icon path={mdiTranslateVariant} />
      <span>{text}</span>
    </BadgeSoft>
  )
}
