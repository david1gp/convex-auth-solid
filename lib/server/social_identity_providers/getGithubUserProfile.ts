import * as v from "valibot"
import { loginProvider } from "~auth/model/socialLoginProvider"
import { authErrorMessages } from "~auth/server/social_identity_providers/authErrorMessages"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import { intOrStringSchema } from "~utils/valibot/intOrStringSchema"

/**
 * https://docs.github.com/en/rest/users/users#get-the-authenticated-user
 * https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/github.ts
 */
export interface GitHubUserProfile {
  login: string
  id: number
  // node_id: string
  avatar_url: string
  // gravatar_id: string
  // url: string
  // html_url: string
  // followers_url: string
  // following_url: string
  // gists_url: string
  // starred_url: string
  // subscriptions_url: string
  // organizations_url: string
  // repos_url: string
  // events_url: string
  // received_events_url: string
  // type: string
  // site_admin: boolean
  name: string
  // company: string|null
  // blog: string
  // location: null
  email: string | null
  // hireable: boolean
  // bio: string
  // twitter_username: string
  // public_repos: number
  // public_gists: number
  // followers: number
  // following: number
  created_at: string
  updated_at: string
}

export const githubOauthUserProfileRootUrl = "https://api.github.com/user"

export async function getGithubUserProfile(access_token: string): PromiseResult<GitHubUserProfile> {
  const op = "getGithubUserProfile"
  const provider = loginProvider.github
  const r = await fetch(githubOauthUserProfileRootUrl, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
  const text = await r.text()
  if (!r.ok) {
    const errorMessage = authErrorMessages.profileFailedToFetchStatus(provider, r.status, text)
    return createResultError(op, errorMessage)
  }
  const result = v.safeParse(v.pipe(v.string(), v.parseJson(), githubProfileSchema), text)
  if (!result.success) {
    const errorMessage = authErrorMessages.profileFailedToParse(provider, result.issues as any, text)
    return createResultError(op, errorMessage, text)
  }
  const profile: GitHubUserProfile = {
    ...result.output,
    created_at: result.output.created_at.toISOString(),
    updated_at: result.output.updated_at.toISOString(),
  }
  return createResult(profile)
}

const githubProfileSchema = v.object({
  login: v.string(),
  id: intOrStringSchema,
  avatar_url: v.string(),
  name: v.string(),
  email: v.nullable(v.string()),
  created_at: v.pipe(
    v.string(),
    v.transform((str) => new Date(str)),
  ),
  updated_at: v.pipe(
    v.string(),
    v.transform((str) => new Date(str)),
  ),
})

function types1(d: v.InferOutput<typeof githubProfileSchema>): GitHubUserProfile {
  return {
    ...d,
    created_at: d.created_at.toISOString(),
    updated_at: d.updated_at.toISOString(),
  }
}
