import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envTelegramTokenResult(): Result<string> {
  const op = "envTelegramTokenResult"
  const name = privateEnvVariableName.TELEGRAM_TOKEN
  const value = process.env.TELEGRAM_TOKEN
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
