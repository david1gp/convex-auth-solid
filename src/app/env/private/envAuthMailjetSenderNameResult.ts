import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envAuthMailjetSenderNameResult(): Result<string> {
  const op = "envAuthMailjetSenderNameResult"
  const name = privateEnvVariableName.AUTH_MAILJET_SENDER_NAME
  const value = process.env.AUTH_MAILJET_SENDER_NAME
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
