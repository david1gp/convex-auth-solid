import { envGithubClientIdResult } from "@/app/env/public/envGithubClientIdResult"
import { envGoogleClientIdResult } from "@/app/env/public/envGoogleClientIdResult"
import { loginProvider, socialLoginProvider, type SocialLoginProvider } from "@/auth/model/socialLoginProvider"
import { urlAuthSignInUsingOauth } from "@/auth/url/urlAuthSignInUsingOauth"

export function urlAuthProvider(provider: SocialLoginProvider, redirectUrl: string = "") {
  return urlOAuthSwitcher(provider, redirectUrl)
}

function urlOAuthSwitcher(provider: SocialLoginProvider, redirectUrl: string = ""): string {
  switch (provider) {
    case socialLoginProvider.github:
      return urlAuthGithub(redirectUrl)
    case socialLoginProvider.google:
      return urlAuthGoogle(redirectUrl)
    // case loginProvider.dev:
    //   return urlAuthDev(redirectUrl)
  }
}

function urlAuthGithub(redirectUrl: string = ""): string {
  const clientIdResult = envGithubClientIdResult()
  if (!clientIdResult.success) {
    console.error(clientIdResult.errorMessage)
    return ""
  }
  const clientId = clientIdResult.data
  const rootUrl = "https://github.com/login/oauth/authorize"
  const options = {
    client_id: clientId,
    redirect_uri: urlAuthSignInUsingOauth(socialLoginProvider.github),
    scope: "user:email",
    state: redirectUrl,
  }
  const qs = new URLSearchParams(options)
  return `${rootUrl}?${qs.toString()}`
}

/**
 * https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#redirecting
 */
function urlAuthGoogle(redirectUrl: string = ""): string {
  const clientIdResult = envGoogleClientIdResult()
  if (!clientIdResult.success) {
    console.error(clientIdResult.errorMessage)
    return ""
  }
  const clientId = clientIdResult.data
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth"
  const options = {
    client_id: clientId,
    redirect_uri: urlAuthSignInUsingOauth(socialLoginProvider.google),
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"].join(
      " ",
    ),
    state: redirectUrl,
  }
  const qs = new URLSearchParams(options)
  return `${rootUrl}?${qs.toString()}`
}

export function urlAuthDev(userId: string, redirectUrl: string = ""): string {
  const rootUrl = urlAuthSignInUsingOauth(loginProvider.dev)
  const options = {
    code: userId,
    state: redirectUrl,
  }
  const qs = new URLSearchParams(options)
  return `${rootUrl}?${qs.toString()}`
}
