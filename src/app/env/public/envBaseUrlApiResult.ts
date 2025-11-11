import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envBaseUrlApiResult(): Result<string> {
  const op = "envBaseUrlApiResult"
  const name = publicEnvVariableName.PUBLIC_BASE_URL_API
  const value = process.env.PUBLIC_BASE_URL_API
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
