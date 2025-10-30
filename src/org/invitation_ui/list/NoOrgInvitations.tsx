import { NoData } from "@/ui/illustrations/NoData"
import { ttt } from "~ui/i18n/ttt"
import type { HasClassAndChildren } from "~ui/utils/HasClassAndChildren"

export function NoOrgInvitations(p: HasClassAndChildren) {
  return (
    <NoData noDataText={ttt("No Organization Invitations")} class={p.class}>
      {p.children}
    </NoData>
  )
}