import { appMotto } from "@/app/text/appMotto"
import { appName } from "@/app/text/appName"
import { getBaseUrlSite } from "@/app/url/getBaseUrl"
import type { FooterV1Type } from "@adaptive-sm/email-generator/index.js"

export function generateSharedEmailProps() {
  return {
    homepageText: appName(),
    homepageUrl: getBaseUrlSite() ?? "",
    hompageSubtitle: appMotto(),
  } as const satisfies FooterV1Type
}
