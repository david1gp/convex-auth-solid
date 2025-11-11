import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envEnvModeResult(): Result<string> {
  const op = "envEnvModeResult"
  const name = publicEnvVariableName.PUBLIC_ENV_MODE
  const value = process.env.PUBLIC_ENV_MODE
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
