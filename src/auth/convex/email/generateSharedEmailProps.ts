import { envBaseUrlSiteResult } from "#src/app/env/public/envBaseUrlSiteResult.js"
import type { Language } from "#src/app/i18n/language.js"
import { appNameServer } from "#src/app/text/appName.js"
import { appSubtitle } from "#src/app/text/appSubtitle.js"
import type { FooterV1Type } from "@adaptive-ds/email-generator/index.js.js"

export function generateSharedEmailProps(l: Language) {
  const siteBaseUrlResult = envBaseUrlSiteResult()
  const siteBaseUrl = siteBaseUrlResult.success ? siteBaseUrlResult.data : ""
  return {
    homepageText: appNameServer(),
    homepageUrl: siteBaseUrl,
    hompageSubtitle: appSubtitle(l),
  } as const satisfies FooterV1Type
}
