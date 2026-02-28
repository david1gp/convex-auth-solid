import { mdiAccountGroup, mdiBriefcase, mdiCalendar, mdiFileDocument } from "@mdi/js"
import { ttc } from "@/app/i18n/ttc"

export type AppTab = keyof typeof appTab

export const appTab = {
  stakeholder: "stakeholder",
  project: "project",
  meeting: "meeting",
  resource: "resource",
} as const

export const appTabIcon = {
  [appTab.stakeholder]: mdiAccountGroup,
  [appTab.project]: mdiBriefcase,
  [appTab.meeting]: mdiCalendar,
  [appTab.resource]: mdiFileDocument,
} as const
