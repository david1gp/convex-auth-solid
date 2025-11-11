import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envAuthResendApiKeyResult(): Result<string> {
  const op = "envAuthResendApiKeyResult"
  const name = privateEnvVariableName.AUTH_RESEND_API_KEY
  const value = process.env.AUTH_RESEND_API_KEY
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
