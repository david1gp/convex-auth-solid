import { socialLoginProvider, type LoginProvider } from "@/auth/model_field/socialLoginProvider"
import { authLog } from "@/auth/server/authLog"
import type { CommonAuthProvider } from "@/auth/server/social_identity_providers/CommonAuthProvider"
import { getGithubOathToken } from "@/auth/server/social_identity_providers/getGithubOathToken"
import {
  getGithubUserProfile,
  type GitHubUserProfile,
} from "@/auth/server/social_identity_providers/getGithubUserProfile"
import { getGoogleOauthToken } from "@/auth/server/social_identity_providers/getGoogleOauthToken"
import {
  getGoogleUserProfile,
  type GoogleUserProfile,
} from "@/auth/server/social_identity_providers/getGoogleUserProfile"
import { getMicrosoftOauthToken } from "@/auth/server/social_identity_providers/getMicrosoftOauthToken"
import {
  getMicrosoftUserProfile,
  type MicrosoftUserProfile,
} from "@/auth/server/social_identity_providers/getMicrosoftUserProfile"
import { createResult, type PromiseResult } from "~utils/result/Result"

export const socialLoginGetUserProfile = {
  github: oauthGithub,
  google: oauthGoogle,
  dev: oauthDev,
  microsoft: oauthMicrosoft,
} satisfies Record<LoginProvider, (cid: string, code: string) => PromiseResult<CommonAuthProvider>>

async function getProfile<T, P>(props: T, fn: (code: T) => PromiseResult<P>): PromiseResult<P> {
  const op = "getProfile"
  const profileOrError = await fn(props)
  if (!profileOrError.success) {
    if (authLog) console.info({ op, msg: "got user profile", profile: profileOrError })
    return profileOrError
  }
  if (authLog) console.info({ op, msg: "got user profile", profile: profileOrError })
  return createResult(profileOrError.data)
}

async function oauthGithub(code: string): PromiseResult<CommonAuthProvider> {
  const op = "oauthGithub"
  const provider = socialLoginProvider.github
  // token
  const tokenOrError = await getGithubOathToken(code)
  if (!tokenOrError.success) return tokenOrError
  // profile
  const profileOrError = await getProfile(tokenOrError.data.access_token, getGithubUserProfile)
  if (!profileOrError.success) {
    return profileOrError
  }
  // data
  return createResult(convertGithubProfile(profileOrError.data))
}

function convertGithubProfile({ id, email, avatar_url, login, name }: GitHubUserProfile): CommonAuthProvider {
  const providerId = id.toFixed(0)
  const provider = socialLoginProvider.github
  return {
    // provider
    provider,
    providerId,
    // data
    givenName: name,
    familyName: "",
    image: avatar_url,
    // email
    email: email ?? "",
    username: login,
  }
}

async function oauthGoogle(code: string): PromiseResult<CommonAuthProvider> {
  const op = "oauthGoogle"
  const provider = socialLoginProvider.google
  // token
  const tokenOrError = await getGoogleOauthToken(code)
  if (!tokenOrError.success) return tokenOrError
  // profile
  const profileOrError = await getProfile(tokenOrError.data, getGoogleUserProfile)
  if (!profileOrError.success) {
    return profileOrError
  }
  // data
  return createResult(convertGoogleProfile(profileOrError.data))
}

function convertGoogleProfile({ id, given_name, family_name, email, picture }: GoogleUserProfile): CommonAuthProvider {
  const providerId = id
  const provider = socialLoginProvider.google
  return {
    // provider
    provider,
    providerId,
    // data
    givenName: given_name,
    familyName: family_name ?? "",
    image: picture,
    // email
    email,
    username: "",
  }
}

async function oauthDev(code: string): PromiseResult<CommonAuthProvider> {
  const op = "oauthDev"
  const data: CommonAuthProvider = {
    // provider
    provider: "dev",
    providerId: code,
    // data
    givenName: code,
    familyName: "",
    image: "",
    // email
    email: "",
    username: "",
  }
  // data
  return createResult(data)
}

async function oauthMicrosoft(code: string): PromiseResult<CommonAuthProvider> {
  const op = "oauthMicrosoft"
  const provider = socialLoginProvider.microsoft

  // token
  const tokenOrError = await getMicrosoftOauthToken(code)
  if (!tokenOrError.success) return tokenOrError

  // profile
  const profileOrError = await getProfile(tokenOrError.data.access_token, getMicrosoftUserProfile)
  if (!profileOrError.success) {
    return profileOrError
  }

  // data - adapt to your CommonAuthProvider shape
  return createResult(convertMicrosoftProfile(profileOrError.data))
}

function convertMicrosoftProfile(p: MicrosoftUserProfile): CommonAuthProvider {
  const providerId = p.id
  const provider = socialLoginProvider.google

  return {
    // provider
    provider,
    providerId,
    // data
    givenName: p.givenName ?? "",
    familyName: p.surname ?? "",
    image: "",
    // email
    email: p.mail ?? "",
    username: p.displayName,
  }
}
