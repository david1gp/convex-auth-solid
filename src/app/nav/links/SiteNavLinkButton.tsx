import { envBaseUrlSiteResult } from "@/app/env/public/envBaseUrlSiteResult"
import { ttc } from "@/app/i18n/ttc"
import { mdiAlphaSCircleOutline } from "@mdi/js"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButtonIconOnly } from "~ui/interactive/link/LinkButtonIconOnly"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

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
