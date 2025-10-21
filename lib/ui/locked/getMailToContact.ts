import { publicEnvVariableName } from "~auth/env/publicEnvVariableName"
import { readEnvVariable } from "~utils/env/readEnvVariable"

export function getMailToContact(): string {
  return readEnvVariable(publicEnvVariableName.PUBLIC_MAILTO_CONTACT_URL) ?? "#"
}
