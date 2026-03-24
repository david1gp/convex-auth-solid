import { LanguageSwitcher } from "#src/app/i18n/ui/LanguageSwitcher.jsx"
import { SiteNavLinkButton } from "#src/app/nav/links/SiteNavLinkButton.jsx"
import { SupportPopover } from "#src/app/nav/links/SupportPopover.jsx"
import { UserNavButton } from "#src/app/nav/UserNavButton.jsx"
import { urlOverview } from "#src/app/pages/urlOverview.js"
import { appNameClient } from "#src/app/text/appName.js"
import { DemosLinkButton } from "#src/ui/links/DemosLinkButton.jsx"
import { ThemeButton } from "#ui/interactive/theme/ThemeButton.jsx"
import { LogoImageOnly } from "#ui/static/logo/LogoImageOnly.jsx"
import { LogoImageText } from "#ui/static/logo/LogoImageText.jsx"
import { classMerge } from "#ui/utils/classMerge.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import type { JSXElement } from "solid-js"

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
