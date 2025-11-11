import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envAuthMailjetApikeyPublicResult(): Result<string> {
  const op = "envAuthMailjetApikeyPublicResult"
  const name = privateEnvVariableName.AUTH_MAILJET_APIKEY_PUBLIC
  const value = process.env.AUTH_MAILJET_APIKEY_PUBLIC
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
