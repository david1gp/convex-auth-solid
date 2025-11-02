import { UserNavButton } from "@/app/nav/UserNavButton"
import { appName } from "@/app/text/appName"
import { DemosLinkButton } from "@/ui/links/DemosLinkButton"
import type { JSXElement } from "solid-js"
import { ThemeButton } from "~ui/interactive/theme/ThemeButton"
import { LogoImageOnly } from "~ui/static/logo/LogoImageOnly"
import { LogoImageText } from "~ui/static/logo/LogoImageText"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface NavStaticProps extends MayHaveClass {
  dense: boolean
  childrenLeft?: JSXElement
  childrenCenter?: JSXElement
  childrenRight?: JSXElement
}

export function NavStatic(p: NavStaticProps) {
  return (
    <nav class={classMerge("flex flex-wrap justify-between gap-4 mx-auto", "w-full max-w-7xl", p.class)}>
      <div class="flex flex-wrap gap-2">
        {p.dense ? (
          <LogoImageOnly />
        ) : (
          <LogoImageText logoText={appName()} logoTextClass="text-md font-medium flex items-center" />
        )}
        {p.childrenLeft}
      </div>
      {p.childrenCenter}
      <div class="flex flex-wrap">
        {p.childrenRight}
        <DemosLinkButton />
        <ThemeButton />
        <UserNavButton />
      </div>
    </nav>
  )
}
