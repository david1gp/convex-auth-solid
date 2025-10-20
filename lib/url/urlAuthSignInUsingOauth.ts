import { publicEnvVariableName } from "~auth/env/publicEnvVariableName"
// import { readEnvVariable } from "~auth/env/readEnvVariable"
import { readEnvVariable } from "~utils/env/readEnvVariable"

export function urlAuthSignInUsingOauth(provider: string) {
  const name = publicEnvVariableName.PUBLIC_BASE_URL_API
  const baseUrlApi = readEnvVariable(name)
  if (!baseUrlApi) throw new Error("!env." + name)
  return `${`${baseUrlApi}/api/auth`}/${provider}`
}
