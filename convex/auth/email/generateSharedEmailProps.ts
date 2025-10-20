import { publicEnvVariableName } from "~auth/env/publicEnvVariableName"
import { readEnvVariable } from "~utils/env/readEnvVariable"
import type { RegisterEmailV1Type } from "../../../../adaptive-email-generator/dist/registerEmailV1Schema"

export function generateSharedEmailProps() {
  return {
    homepageText:
      readEnvVariable(publicEnvVariableName.PUBLIC_EMAIL_TEMPLATE_HOMEPAGE_NAME) ??
      " missing EMAIL_TEMPLATE_HOMEPAGE_NAME",
    homepageUrl:
      readEnvVariable(publicEnvVariableName.PUBLIC_EMAIL_TEMPLATE_HOMEPAGE_URL) ??
      " missing EMAIL_TEMPLATE_HOMEPAGE_URL",
    mottoText:
      readEnvVariable(publicEnvVariableName.PUBLIC_EMAIL_TEMPLATE_HOMEPAGE_MOTTO) ??
      " missing EMAIL_TEMPLATE_HOMEPAGE_MOTTO",
  } as const satisfies Partial<RegisterEmailV1Type>
}
