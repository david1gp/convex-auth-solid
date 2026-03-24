import { LanguageSwitcher } from "#src/app/i18n/ui/LanguageSwitcher.js"
import { SiteNavLinkButton } from "#src/app/nav/links/SiteNavLinkButton.js"
import { SupportPopover } from "#src/app/nav/links/SupportPopover.js"
import { UserNavButton } from "#src/app/nav/UserNavButton.js"
import { urlOverview } from "#src/app/pages/urlOverview.js"
import { appNameClient } from "#src/app/text/appName.js"
import { DemosLinkButton } from "#src/ui/links/DemosLinkButton.js"
import { ThemeButton } from "#ui/interactive/theme/ThemeButton"
import { LogoImageOnly } from "#ui/static/logo/LogoImageOnly"
import { LogoImageText } from "#ui/static/logo/LogoImageText"
import { classMerge } from "#ui/utils/classMerge"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"
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
