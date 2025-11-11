import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envBaseUrlEmailGeneratorResult(): Result<string> {
  const op = "envBaseUrlEmailGeneratorResult"
  const name = privateEnvVariableName.BASE_URL_EMAIL_GENERATOR
  const value = process.env.BASE_URL_EMAIL_GENERATOR
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
