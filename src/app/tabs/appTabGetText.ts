import { ttc } from "#src/app/i18n/ttc.js"
import { appTab, type AppTab } from "#src/app/tabs/appTab.js"

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
