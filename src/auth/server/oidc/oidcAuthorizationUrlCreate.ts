import { createResult, createResultError, type PromiseResult } from "#result"
import type { OidcConfig } from "#src/auth/server/oidc/oidcConfig.ts"
import type { OidcDiscovery } from "#src/auth/server/oidc/oidcDiscoverySchema.ts"

type OidcAuthorizationUrlCreateInput = {
  config: OidcConfig
  discovery: OidcDiscovery
  redirectUri: string
  state: string
  nonce: string
  codeVerifier: string
}

export async function oidcAuthorizationUrlCreate(input: OidcAuthorizationUrlCreateInput): PromiseResult<string> {
  const op = "oidcAuthorizationUrlCreate"
  if (input.discovery.issuer !== input.config.issuer) return createResultError(op, "OIDC discovery issuer mismatch")
  if (!oidcAuthorizationParameterIsValid(input.state) || !oidcAuthorizationParameterIsValid(input.nonce)) {
    return createResultError(op, "invalid OIDC authorization transaction")
  }
  if (!/^[A-Za-z0-9._~-]{43,128}$/u.test(input.codeVerifier)) {
    return createResultError(op, "invalid OIDC PKCE verifier")
  }
  if (!input.config.scopes.includes("openid")) return createResultError(op, "OIDC scopes must include openid")
  if (!oidcRedirectUriIsValid(input.redirectUri)) return createResultError(op, "invalid OIDC redirect URI")

  let authorizationUrl: URL
  try {
    authorizationUrl = new URL(input.discovery.authorization_endpoint)
  } catch {
    return createResultError(op, "invalid OIDC authorization endpoint")
  }
  if (!oidcHttpsUrlIsValid(authorizationUrl.toString()))
    return createResultError(op, "invalid OIDC authorization endpoint")

  let codeChallenge: string
  try {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input.codeVerifier))
    codeChallenge = oidcBase64urlEncode(new Uint8Array(digest))
  } catch {
    return createResultError(op, "could not create OIDC PKCE challenge")
  }

  const parameters = new URLSearchParams({
    client_id: input.config.clientId,
    redirect_uri: input.redirectUri,
    response_type: "code",
    scope: input.config.scopes.join(" "),
    state: input.state,
    nonce: input.nonce,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  })
  for (const [key, value] of parameters) authorizationUrl.searchParams.set(key, value)
  return createResult(authorizationUrl.toString())
}

function oidcAuthorizationParameterIsValid(value: string): boolean {
  return /^[A-Za-z0-9._~-]{1,128}$/u.test(value)
}

function oidcRedirectUriIsValid(value: string): boolean {
  try {
    const url = new URL(value)
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password && !url.hash
  } catch {
    return false
  }
}

function oidcHttpsUrlIsValid(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash
  } catch {
    return false
  }
}

function oidcBase64urlEncode(bytes: Uint8Array): string {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "")
}
