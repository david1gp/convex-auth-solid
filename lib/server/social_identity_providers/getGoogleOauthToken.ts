import * as v from "valibot"
import { privateEnvVariableName } from "~auth/env/privateEnvVariableName"
import { publicEnvVariableName } from "~auth/env/publicEnvVariableName"
import { socialLoginProvider } from "~auth/model/socialLoginProvider"
import { authErrorMessages } from "~auth/server/social_identity_providers/authErrorMessages"
import { urlAuthSignInUsingOauth } from "~auth/url/urlAuthSignInUsingOauth"
import { readEnvVariableResult } from "~utils/env/readEnvVariable"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import { queryString } from "~utils/url/queryString"
import { intMin1OrStringSchema } from "~utils/valibot/intOrStringSchema"

export interface GoogleOauthToken {
  access_token: string
  id_token: string
  expires_in: number
  refresh_token: string
  token_type: string
  scope: string
}

export const googleOAuthTokenRootUrl = "https://oauth2.googleapis.com/token"

/**
 * https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#redirecting
 * https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/google.ts
 * https://github.com/pilcrowOnPaper/arctic/blob/main/src/providers/google.ts
 */
export async function getGoogleOauthToken(code: string): PromiseResult<GoogleOauthToken> {
  const op = "getGoogleOauthToken"
  const provider = socialLoginProvider.google

  const clientSecretResult = readEnvVariableResult(privateEnvVariableName.GOOGLE_CLIENT_SECRET)
  if (!clientSecretResult.success) return clientSecretResult
  const clientSecret = clientSecretResult.data

  const clientIdResult = readEnvVariableResult(publicEnvVariableName.PUBLIC_GOOGLE_CLIENT_ID)
  if (!clientIdResult.success) return clientIdResult
  const clientId = clientIdResult.data

  const options = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: urlAuthSignInUsingOauth(provider),
    grant_type: "authorization_code",
  }
  const r = await fetch(googleOAuthTokenRootUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: queryString(options),
  })
  const text = await r.text()
  // console.log(op, "text:", text)
  if (!r.ok) {
    const errorMessage = authErrorMessages.tokenFailedToFetchStatus(provider, r.status, text)
    return createResultError(op, errorMessage)
  }
  const result = v.safeParse(v.pipe(v.string(), v.parseJson(), googleOauthTokenSchema), text)
  if (!result.success) {
    const errorMessage = authErrorMessages.tokenFailedToParse(provider, result.issues as any, text)
    return createResultError(op, errorMessage, text)
  }
  return createResult(result.output)
}

export const googleOauthTokenSchema = v.object({
  access_token: v.string(),
  id_token: v.string(),
  expires_in: intMin1OrStringSchema,
  refresh_token: v.string(),
  token_type: v.string(),
  scope: v.string(),
})

function types1(d: v.InferOutput<typeof googleOauthTokenSchema>): GoogleOauthToken {
  return { ...d }
}
