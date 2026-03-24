import { createResult, createResultError, type Result } from "#result"
import { envVariableErrorMessage } from "#src/app/env/envVariableErrorMessage.js"
import { privateEnvVariableName } from "#src/app/env/privateEnvVariableName.js"

export function envGithubClientSecretResult(): Result<string> {
  const op = "envGithubClientSecretResult"
  const name = privateEnvVariableName.GITHUB_CLIENT_SECRET
  const value = process.env.GITHUB_CLIENT_SECRET
  if (!value) {
    const errorMessage = envVariableErrorMessage(name)
    return createResultError(op, errorMessage)
  }
  return createResult(value)
}
