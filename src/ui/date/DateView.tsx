import { ttc } from "@/app/i18n/ttc"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from "dayjs/plugin/utc"
import type { JSXElement } from "solid-js"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

dayjs.extend(relativeTime)
dayjs.extend(utc)

export interface DateViewProps extends MayHaveClass {
  start?: string | JSXElement
  date: string
  showAt?: boolean
  end?: string | JSXElement
  relativeClass?: string
  absoluteClass?: string
}

export function DateView(p: DateViewProps) {
  const dateObj = dayjs(p.date)
  const now = dayjs()
  const isSameDay = dateObj.isSame(now, "day")
  const timeAgo = dateObj.fromNow()
  const absoluteTime = isSameDay ? dateObj.format("HH:mm") : dateObj.format("MMM D, YYYY")
  const utcTime = dateObj.utc().format("YYYY-MM-DD HH:mm:ss UTC")

  const at = " " + ttc("at") + " "

  return (
    <time datetime={p.date} title={utcTime} class={p.class}>
      {p.start}
      <span class={classMerge("font-medium", p.relativeClass)}>{timeAgo}</span>
      {p.showAt || (p.showAt === undefined && <span>{at}</span>)}
      <span class={p.absoluteClass}>{absoluteTime}</span>
      {p.end}
    </time>
  )
}
