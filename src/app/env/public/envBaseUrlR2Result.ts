import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envBaseUrlR2Result(): Result<string> {
  const op = "envBaseUrlR2Result"
  const name = publicEnvVariableName.PUBLIC_BASE_URL_R2
  const value = process.env.PUBLIC_BASE_URL_R2
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
