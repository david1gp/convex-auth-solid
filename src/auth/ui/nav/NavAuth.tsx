import { appName } from "@/app/text/appName"
import { UserNavButton } from "@/auth/ui/nav/UserNavButton"
import { ThemeButton } from "~ui/interactive/theme/ThemeButton"
import { LogoImageOnly } from "~ui/static/logo/LogoImageOnly"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface NavAuthProps extends MayHaveChildren, MayHaveClass {}

export function NavAuth(p: NavAuthProps) {
  return (
    <nav class={classMerge("flex flex-wrap justify-between gap-4 mx-auto", "w-full max-w-7xl", p.class)}>
      <div class="flex flex-wrap">
        <LogoImageOnly />
        <p class="text-lg font-semibold flex items-center">{appName()}</p>
      </div>
      {p.children}
      <div class="flex flex-wrap">
        <ThemeButton />
        <UserNavButton />
      </div>
    </nav>
  )
}
