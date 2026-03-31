import { ttc } from "#src/app/i18n/ttc.ts"
import { appTab, type AppTab } from "#src/app/tabs/appTab.ts"

export function appTabGetText(tab: string): string {
  switch (tab as AppTab) {
    case appTab.org:
      return ttc("Organization")
    case appTab.workspace:
      return ttc("Workspaces")
    case appTab.resource:
      return ttc("Resources")
  }
}
