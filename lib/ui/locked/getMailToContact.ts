import { publicEnvVariableName } from "~auth/env/publicEnvVariableName"
import { readEnvVariable } from "~utils/env/readEnvVariable"

export function getMailToContact() {
  return readEnvVariable(publicEnvVariableName.PUBLIC_MAILTO_CONTACT_URL)
}
