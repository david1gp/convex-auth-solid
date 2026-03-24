import { hasDevMode } from "#src/app/config/hasDevMode.js"
import { inDevModeSignal, onDevModeSignalRegisterHandler } from "#src/app/config/inDevModeSignal.js"
import { ttt } from "#ui/i18n/ttt.js"
import { ToggleButtonIconOnly } from "#ui/interactive/toggle/ToggleButtonIconOnly.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import { mdiCodeBraces, mdiCodeJson } from "@mdi/js"

export function DevModeToggle(p: MayHaveClass) {
  if (!hasDevMode()) return null
  onDevModeSignalRegisterHandler()
  return (
    <ToggleButtonIconOnly
      title={ttt("In Dev Mode:") + " " + (inDevModeSignal.get() ? ttt("Active") : ttt("Disabled"))}
      pressedSignal={inDevModeSignal}
      icon={inDevModeSignal.get() ? mdiCodeJson : mdiCodeBraces}
      class={p.class}
    />
  )
}
