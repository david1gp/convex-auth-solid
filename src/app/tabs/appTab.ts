import { mdiAccountGroup, mdiBriefcase, mdiFileDocument } from "@mdi/js"

export type AppTab = keyof typeof appTab

export const appTab = {
  org: "org",
  workspace: "workspace",
  resource: "resource",
} as const

export const appTabIcon = {
  [appTab.org]: mdiAccountGroup,
  [appTab.workspace]: mdiBriefcase,
  [appTab.resource]: mdiFileDocument,
} as const
