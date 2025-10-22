import { appMotto } from "@/app/text/appMotto"
import { appName } from "@/app/text/appName"
import { getBaseUrlSite } from "@/app/url/getBaseUrl"
import type { LoginCodeV1Type } from "@adaptive-sm/email-generator/LoginCodeV1Type.js"
import type { RegisterEmailV1Type } from "@adaptive-sm/email-generator/RegisterEmailV1Type.d.ts"

export function generateSharedEmailProps() {
  return {
    homepageText: appName(),
    homepageUrl: getBaseUrlSite() ?? "",
    mottoText: appMotto(),
  } as const satisfies Partial<RegisterEmailV1Type | LoginCodeV1Type>
}
