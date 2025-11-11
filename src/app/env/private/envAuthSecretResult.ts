import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envAuthSecretResult(): Result<string> {
  const op = "envAuthSecretResult"
  const name = privateEnvVariableName.AUTH_SECRET
  const value = process.env.AUTH_SECRET
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
