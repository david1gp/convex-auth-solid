import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

export function envGithubClientIdResult(): Result<string> {
  const op = "envGithubClientIdResult"
  const name = publicEnvVariableName.PUBLIC_GITHUB_CLIENT_ID
  const value = process.env.PUBLIC_GITHUB_CLIENT_ID
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
