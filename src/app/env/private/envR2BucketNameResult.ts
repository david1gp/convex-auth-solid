import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envR2BucketNameResult(): Result<string> {
  const op = "envR2BucketNameResult"
  const name = privateEnvVariableName.R2_BUCKET_NAME
  const value = process.env.R2_BUCKET_NAME
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
