import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envGoogleClientSecretResult(): Result<string> {
  const op = "envGoogleClientSecretResult"
  const name = privateEnvVariableName.GOOGLE_CLIENT_SECRET
  const value = process.env.GOOGLE_CLIENT_SECRET
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
