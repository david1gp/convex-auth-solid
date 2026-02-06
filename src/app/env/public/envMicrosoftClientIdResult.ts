import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envMicrosoftClientIdResult(): Result<string> {
  const op = "envMicrosoftClientIdResult"
  const name = publicEnvVariableName.PUBLIC_MICROSOFT_CLIENT_ID
  const value = process.env.PUBLIC_MICROSOFT_CLIENT_ID
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
