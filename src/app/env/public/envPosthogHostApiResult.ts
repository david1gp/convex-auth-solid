import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envPosthogHostApiResult(): Result<string> {
  const op = "envPosthogAppApiResult"
  const name = publicEnvVariableName.PUBLIC_POSTHOG_HOST_API
  const value = process.env.PUBLIC_POSTHOG_HOST_API
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
