import { publicEnvVariableName } from "@/auth/env/publicEnvVariableName"
import { readEnvVariable } from "~utils/env/readEnvVariable"

export function getBaseUrlSite(): string | undefined {
  return readEnvVariable(publicEnvVariableName.PUBLIC_BASE_URL_SITE)
}

export function getBaseUrlApp(): string | undefined {
  return readEnvVariable(publicEnvVariableName.PUBLIC_BASE_URL_APP)
}

export function getBaseUrlApi(): string | undefined {
  return readEnvVariable(publicEnvVariableName.PUBLIC_BASE_URL_API)
}

export function getBaseUrlConvex(): string | undefined {
  return readEnvVariable(publicEnvVariableName.PUBLIC_BASE_URL_CONVEX)
}

export function getBaseUrlSignedIn(): string {
  return readEnvVariable(publicEnvVariableName.PUBLIC_SIGNED_IN_DEFAULT_PATH) ?? "/"
}
