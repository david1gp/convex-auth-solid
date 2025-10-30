import { NoData } from "@/ui/illustrations/NoData"
import { ttt } from "~ui/i18n/ttt"
import type { MayHaveClassAndChildren } from "~ui/utils/MayHaveClassAndChildren"

export function NoOrgMembers(p: MayHaveClassAndChildren) {
  return (
    <NoData noDataText={ttt("No Organization Members")} class={p.class}>
      {p.children}
    </NoData>
  )
}
