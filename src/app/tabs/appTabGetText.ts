import { ttc } from "@/app/i18n/ttc"
import { appTab, type AppTab } from "@/app/tabs/appTab"

export function appTabGetText(tab: string) {
  switch (tab as AppTab) {
    case appTab.stakeholder:
      return ttc("Stakeholders")
    case appTab.project:
      return ttc("Projects")
    case appTab.meeting:
      return ttc("Events")
    case appTab.resource:
      return ttc("Resources")
  }
}
