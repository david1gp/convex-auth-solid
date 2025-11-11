import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envTelegramTopicIdResult(): Result<string> {
  const op = "envTelegramTopicIdResult"
  const name = privateEnvVariableName.TELEGRAM_TOPIC_ID
  const value = process.env.TELEGRAM_TOPIC_ID
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
