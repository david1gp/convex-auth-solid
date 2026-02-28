import { LanguageSwitcher } from "@/app/i18n/ui/LanguageSwitcher"
import { SiteNavLinkButton } from "@/app/nav/links/SiteNavLinkButton"
import { SupportPopover } from "@/app/nav/links/SupportPopover"
import { UserNavButton } from "@/app/nav/UserNavButton"
import { urlOverview } from "@/app/pages/urlOverview"
import { appNameClient } from "@/app/text/appName"
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
  sitePath?: string
}

export function NavStatic(p: NavStaticProps) {
  return (
    <nav class={classMerge("flex flex-wrap justify-between mx-auto", "w-full max-w-7xl", "mb-4", p.class)}>
      <div class="flex flex-wrap gap-2">
        {p.dense ? (
          <LogoImageOnly href={urlOverview()} />
        ) : (
          <LogoImageText
            href={urlOverview()}
            logoText={appNameClient()}
            logoTextClass="text-md font-medium flex items-center"
          />
        )}
        {p.childrenLeft}
      </div>
      {p.childrenCenter}
      <div class="flex flex-wrap">
        {p.childrenRight}
        <DemosLinkButton />
        <SiteNavLinkButton sitePath={p.sitePath} />
        <SupportPopover />
        <LanguageSwitcher />
        <ThemeButton />
        <UserNavButton />
      </div>
    </nav>
  )
}
