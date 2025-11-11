import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envPosthogAppIdResult(): Result<string> {
  const op = "envPosthogAppIdResult"
  const name = publicEnvVariableName.PUBLIC_POSTHOG_APP_ID
  const value = process.env.PUBLIC_POSTHOG_APP_ID
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
