import { envVariableErrorMessage } from "@/app/env/envVariableErrorMessage"
import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { createResult, createResultError, type Result } from "~utils/result/Result"

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
