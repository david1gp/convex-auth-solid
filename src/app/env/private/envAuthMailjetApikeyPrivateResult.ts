import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envAuthMailjetApikeyPrivateResult(): Result<string> {
  const op = "getAuthMailjetApikeyPrivateResult"
  const name = privateEnvVariableName.AUTH_MAILJET_APIKEY_PRIVATE
  const value = process.env.AUTH_MAILJET_APIKEY_PRIVATE
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
