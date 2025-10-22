import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { socialLoginProvider } from "@/auth/model/socialLoginProvider"
import * as v from "valibot"
import { readEnvVariableResult } from "~utils/env/readEnvVariable"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import { queryString } from "~utils/url/queryString"
import { searchParamsToObject } from "~utils/url/searchParamsToObject"
import { authErrorMessages } from "./authErrorMessages"

export type GitHubOauthToken = {
  access_token: string
}

export const githubOauthTokenRootUrl = "https://github.com/login/oauth/access_token"

/**
 * https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
 * https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/github.ts
 * https://github.com/pilcrowOnPaper/arctic/blob/main/src/providers/github.ts
 */
export async function getGithubOathToken(code: string): PromiseResult<GitHubOauthToken> {
  const op = "getGithubOathToken"
  const provider = socialLoginProvider.github

  const clientSecretResult = readEnvVariableResult(privateEnvVariableName.GITHUB_CLIENT_SECRET)
  if (!clientSecretResult.success) return clientSecretResult
  const clientSecret = clientSecretResult.data

  const clientIdResult = readEnvVariableResult(publicEnvVariableName.PUBLIC_GITHUB_CLIENT_ID)
  if (!clientIdResult.success) return clientIdResult
  const clientId = clientIdResult.data

  const options = {
    client_id: clientId,
    client_secret: clientSecret,
    // redirect_uri: urlApiOauth(socialLoginProvider.github),
    code,
  }
  const r = await fetch(`${githubOauthTokenRootUrl}?${queryString(options)}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
  const text = await r.text()
  if (!r.ok) {
    const errorMessage = authErrorMessages.tokenFailedToFetchStatus(provider, r.status, text)
    return createResultError(op, errorMessage)
  }
  const json = searchParamsToObject(text)
  const result = v.safeParse(githubSchema, json)
  if (!result.success) {
    const errorMessage = authErrorMessages.tokenFailedToParse(provider, result.issues as any, text)
    return createResultError(op, errorMessage, text)
  }
  return createResult({ access_token: result.output.access_token })
}

const githubSchema = v.object({
  access_token: v.string(),
})

function types1(d: v.InferOutput<typeof githubSchema>): GitHubOauthToken {
  return { ...d }
}
