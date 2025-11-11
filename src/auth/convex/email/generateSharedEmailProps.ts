import { envBaseUrlSiteResult } from "@/app/env/public/envBaseUrlSiteResult"
import { appNameServer } from "@/app/text/appName"
import { appSubtitle } from "@/app/text/appSubtitle"
import type { FooterV1Type } from "@adaptive-sm/email-generator/index.js"

export function generateSharedEmailProps() {
  const siteBaseUrlResult = envBaseUrlSiteResult()
  const siteBaseUrl = siteBaseUrlResult.success ? siteBaseUrlResult.data : ""
  return {
    homepageText: appNameServer(),
    homepageUrl: siteBaseUrl,
    hompageSubtitle: appSubtitle(),
  } as const satisfies FooterV1Type
}
