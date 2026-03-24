import { createResult, createResultError, type Result } from "#result"
import { envVariableErrorMessage } from "#src/app/env/envVariableErrorMessage.js"
import { privateEnvVariableName } from "#src/app/env/privateEnvVariableName.js"

export function envAuthResendSenderAddressResult(): Result<string> {
  const op = "envAuthResendSenderAddressResult"
  const name = privateEnvVariableName.AUTH_RESEND_SENDER_ADDRESS
  const value = process.env.AUTH_RESEND_SENDER_ADDRESS
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
