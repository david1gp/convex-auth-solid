import { envBaseUrlSiteResult } from "#src/app/env/public/envBaseUrlSiteResult.ts"
import { ttc } from "#src/app/i18n/ttc.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButtonIconOnly } from "#ui/interactive/link/LinkButtonIconOnly.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { mdiAlphaSCircleOutline } from "@mdi/js"

export interface SiteNavLinkButtonProps extends MayHaveClass {
  sitePath?: string
}

export function SiteNavLinkButton(p: SiteNavLinkButtonProps) {
  return (
    <LinkButtonIconOnly
      href={p.sitePath ? getSiteBaseUrl() + p.sitePath : getSiteBaseUrl()}
      title={ttc("Go to public website")}
      variant={buttonVariant.ghost}
      icon={mdiAlphaSCircleOutline}
      iconClass="size-7"
      newTab
    />
  )
}

function getSiteBaseUrl() {
  const r = envBaseUrlSiteResult()
  if (!r.success) return ""
  return r.data
}
