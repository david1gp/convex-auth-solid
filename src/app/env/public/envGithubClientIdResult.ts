import { createResult, createResultError, type Result } from "#result"
import { envVariableErrorMessage } from "#src/app/env/envVariableErrorMessage.js"
import { publicEnvVariableName } from "#src/app/env/publicEnvVariableName.js"

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
