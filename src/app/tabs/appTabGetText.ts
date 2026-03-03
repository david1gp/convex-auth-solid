import { ttc } from "@/app/i18n/ttc"
import { appTab, type AppTab } from "@/app/tabs/appTab"

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
