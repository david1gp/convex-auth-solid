import { mdiAccountGroup } from "@adaptive-ds/mdi/mdiAccountGroup.js"
import { mdiBriefcase } from "@adaptive-ds/mdi/mdiBriefcase.js"
import { mdiFileDocument } from "@adaptive-ds/mdi/mdiFileDocument.js"

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
