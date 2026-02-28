import { languageSignalGet } from "@/app/i18n/languageSignal"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { dateFormatFull } from "~utils/date/dateFormat"

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
