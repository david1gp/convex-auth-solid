import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envBaseUrlConvexResult(): Result<string> {
  const op = "envBaseUrlConvexResult"
  const name = publicEnvVariableName.PUBLIC_BASE_URL_CONVEX
  const value = process.env.PUBLIC_BASE_URL_CONVEX
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
