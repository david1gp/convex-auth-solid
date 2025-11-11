import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envBaseUrlAppResult(): Result<string> {
  const op = "envBaseUrlAppResult"
  const name = publicEnvVariableName.PUBLIC_BASE_URL_APP
  const value = process.env.PUBLIC_BASE_URL_APP
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
