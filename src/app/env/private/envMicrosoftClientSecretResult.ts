import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envMicrosoftClientSecretResult(): Result<string> {
  const op = "envMicrosoftClientSecretResult"
  const name = privateEnvVariableName.MICROSOFT_CLIENT_SECRET
  const value = process.env.MICROSOFT_CLIENT_SECRET
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
