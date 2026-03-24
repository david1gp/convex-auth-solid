import type { Language } from "#src/app/i18n/language.js"
import { ttt } from "#ui/i18n/ttt.js"

export function appSubtitle(l?: Language): string {
  return ttt("Build authenticated SolidJS apps lightning-fast with Convex")
}
