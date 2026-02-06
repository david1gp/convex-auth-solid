import { hasDevMode } from "@/app/config/hasDevMode"
import { inDevModeSignal, onDevModeSignalRegisterHandler } from "@/app/config/inDevModeSignal"
import { ttt } from "~ui/i18n/ttt"
import { mdiCodeBraces, mdiCodeJson } from "@mdi/js"
import { ToggleButtonIconOnly } from "~ui/interactive/toggle/ToggleButtonIconOnly"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

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
