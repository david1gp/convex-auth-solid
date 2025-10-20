import * as v from "valibot"
import { loginProvider } from "~auth/model/socialLoginProvider"
import { authErrorMessages } from "~auth/server/social_identity_providers/authErrorMessages"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"

/**
 * https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/google.ts
 */
export interface GoogleUserProfile {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name?: string
  picture: string
  // locale: string
}

export const googleOauthUserProfileRootUrl = "https://www.googleapis.com/oauth2/v1/userinfo"

/**
 * https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/google.ts
 */
export async function getGoogleUserProfile({
  id_token,
  access_token,
}: {
  id_token: string
  access_token: string
}): PromiseResult<GoogleUserProfile> {
  const op = "getGoogleUserProfile"
  const provider = loginProvider.google
  const r = await fetch(`${googleOauthUserProfileRootUrl}?alt=json&access_token=${access_token}`, {
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  })
  const text = await r.text()
  if (!r.ok) {
    const errorMessage = authErrorMessages.profileFailedToFetchStatus(provider, r.status, text)
    return createResultError(op, errorMessage)
  }
  const result = v.safeParse(v.pipe(v.string(), v.parseJson(), googleUserProfileSchema), text)
  if (!result.success) {
    const errorMessage = authErrorMessages.profileFailedToParse(provider, result.issues as any, text)
    return createResultError(op, errorMessage, text)
  }
  return createResult(result.output)
}

const googleUserProfileSchema = v.object({
  id: v.string(),
  email: v.string(),
  verified_email: v.boolean(),
  name: v.string(),
  given_name: v.string(),
  family_name: v.optional(v.string()),
  picture: v.string(),
  // locale: v.optional(v.string()),
})

function types1(d: v.InferOutput<typeof googleUserProfileSchema>): GoogleUserProfile {
  return { ...d }
}
