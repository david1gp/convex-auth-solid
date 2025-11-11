import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envPosthogAppUiResult(): Result<string> {
  const op = "envPosthogAppUiResult"
  const name = publicEnvVariableName.PUBLIC_POSTHOG_APP_UI
  const value = process.env.PUBLIC_POSTHOG_APP_UI
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
