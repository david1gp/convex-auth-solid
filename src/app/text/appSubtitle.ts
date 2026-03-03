import type { Language } from "@/app/i18n/language"
import { ttt } from "~ui/i18n/ttt"

export function appSubtitle(l?: Language): string {
  return ttt("Build authenticated SolidJS apps lightning-fast with Convex")
}
