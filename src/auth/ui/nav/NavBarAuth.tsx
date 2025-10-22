import { appName } from "@/app/appName"
import { NavApp } from "@/auth/ui/nav/NavApp"
import type { MayHaveClass } from "~ui/utils/ui/MayHaveClass"

export function NavBarAuth(p: MayHaveClass) {
  return (
    <NavApp>
      <p class="text-2xl font-semibold flex items-center">{appName}</p>
    </NavApp>
  )
}
