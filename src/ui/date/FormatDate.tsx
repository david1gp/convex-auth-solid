import { languageSignalGet } from "#src/app/i18n/languageSignal.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import { dateFormatFull } from "#utils/date/dateFormat.js"

export interface FormatDateProps extends MayHaveClass {
  date: string
}

export function FormatDate(p: FormatDateProps) {
  const absoluteTime = dateFormatFull(p.date, languageSignalGet())
  return (
    <time datetime={p.date} class={p.class}>
      <span>{absoluteTime}</span>
    </time>
  )
}
