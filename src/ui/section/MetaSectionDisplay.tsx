import type { Language } from "@/app/i18n/language"
import { languageGetText } from "@/app/i18n/languageGetText"
import { visibility, type Visibility } from "@/resource/model_field/visibility"
import { visibilityGetText } from "@/resource/model_field/visibilityGetText"
import { BadgeSoft } from "@/ui/badge/BadgeSoft"
import { mdiEye, mdiEyeOff, mdiTranslateVariant } from "@mdi/js"
import { Show } from "solid-js"
import { Icon } from "~ui/static/icon/Icon"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

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
