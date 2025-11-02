import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from "dayjs/plugin/utc"
import type { JSXElement } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

dayjs.extend(relativeTime)
dayjs.extend(utc)

export interface DateViewProps extends MayHaveClass {
  start?: string | JSXElement
  date: string
  end?: string | JSXElement
}

export function DateView(p: DateViewProps) {
  const dateObj = dayjs(p.date)
  const now = dayjs()
  const isSameDay = dateObj.isSame(now, "day")
  const timeAgo = dateObj.fromNow()
  const absoluteTime = isSameDay ? dateObj.format("HH:mm") : dateObj.format("MMM D, YYYY")
  const utcTime = dateObj.utc().format("YYYY-MM-DD HH:mm:ss UTC")

  const at = " " + ttt("at") + " "

  return (
    <time class={p.class} datetime={p.date} title={utcTime}>
      {p.start}
      <span class="font-medium">{timeAgo}</span>
      <span>{at}</span>
      <span>{absoluteTime}</span>
      {p.end}
    </time>
  )
}
