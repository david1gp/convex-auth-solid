import { envBaseUrlSiteResult } from "@/app/env/public/envBaseUrlSiteResult"
import type { Language } from "@/app/i18n/language"
import { appNameServer } from "@/app/text/appName"
import { appSubtitle } from "@/app/text/appSubtitle"
import type { FooterV1Type } from "@adaptive-ds/email-generator/index.js"

export function generateSharedEmailProps(l: Language) {
  const siteBaseUrlResult = envBaseUrlSiteResult()
  const siteBaseUrl = siteBaseUrlResult.success ? siteBaseUrlResult.data : ""
  return {
    homepageText: appNameServer(),
    homepageUrl: siteBaseUrl,
    hompageSubtitle: appSubtitle(l),
  } as const satisfies FooterV1Type
}
