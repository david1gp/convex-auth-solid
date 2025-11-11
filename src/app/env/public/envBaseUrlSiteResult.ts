import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envBaseUrlSiteResult(): Result<string> {
  const op = "envBaseUrlSiteResult"
  const name = publicEnvVariableName.PUBLIC_BASE_URL_SITE
  const value = process.env.PUBLIC_BASE_URL_SITE
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
