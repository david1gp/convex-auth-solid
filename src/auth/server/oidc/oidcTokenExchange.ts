import * as a from "valibot"
import { createResult, createResultError, type PromiseResult, resultTryParsingFetchErr } from "#result"
import type { OidcConfig } from "#src/auth/server/oidc/oidcConfig.ts"
import type { OidcDiscovery } from "#src/auth/server/oidc/oidcDiscoverySchema.ts"
import { type OidcTokenResponse, oidcTokenResponseSchema } from "#src/auth/server/oidc/oidcTokenResponseSchema.ts"

type OidcTokenExchangeInput = {
  config: OidcConfig
  discovery: OidcDiscovery
  code: string
  codeVerifier: string
  redirectUri: string
}

export async function oidcTokenExchange(input: OidcTokenExchangeInput): PromiseResult<OidcTokenResponse> {
  const op = "oidcTokenExchange"
  if (input.discovery.issuer !== input.config.issuer) return createResultError(op, "OIDC discovery issuer mismatch")
  if (!input.code || input.code.length > 4096 || !/^[A-Za-z0-9._~-]{43,128}$/u.test(input.codeVerifier)) {
    return createResultError(op, "missing or invalid OIDC code or PKCE verifier")
  }
  if (!oidcRedirectUriIsValid(input.redirectUri)) return createResultError(op, "invalid OIDC redirect URI")
  if (!oidcHttpsUrlIsValid(input.discovery.token_endpoint)) return createResultError(op, "invalid OIDC token endpoint")

  const clientAuthentication = oidcClientAuthenticationMethodGet(input.config, input.discovery)
  if (!clientAuthentication)
    return createResultError(op, "OIDC provider does not support configured client authentication")

  const body = new URLSearchParams({
    code: input.code,
    code_verifier: input.codeVerifier,
    grant_type: "authorization_code",
    redirect_uri: input.redirectUri,
  })
  const headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  })
  if (clientAuthentication === "none" || clientAuthentication === "client_secret_post") {
    body.set("client_id", input.config.clientId)
  }
  if (clientAuthentication === "client_secret_post" && input.config.clientSecret) {
    body.set("client_secret", input.config.clientSecret)
  }
  if (clientAuthentication === "client_secret_basic" && input.config.clientSecret) {
    headers.set(
      "Authorization",
      `Basic ${oidcBasicCredentialsEncode(input.config.clientId, input.config.clientSecret)}`,
    )
  }

  let response: Response
  let text: string
  try {
    response = await fetch(input.discovery.token_endpoint, { method: "POST", headers, body: body.toString() })
    text = await response.text()
  } catch {
    return createResultError(op, "could not exchange OIDC authorization code")
  }
  if (!response.ok) return resultTryParsingFetchErr(op, text, response.status, response.statusText)

  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    return createResultError(op, "invalid OIDC token response JSON")
  }
  const parsed = a.safeParse(oidcTokenResponseSchema, json)
  if (!parsed.success) return createResultError(op, "invalid OIDC token response")
  return createResult(parsed.output)
}

function oidcClientAuthenticationMethodGet(
  config: OidcConfig,
  discovery: OidcDiscovery,
): "none" | "client_secret_basic" | "client_secret_post" | undefined {
  const methods = discovery.token_endpoint_auth_methods_supported
  if (!config.clientSecret) {
    if (methods !== undefined && !methods.includes("none")) return
    return "none"
  }
  if (methods === undefined || methods.includes("client_secret_basic")) return "client_secret_basic"
  if (methods.includes("client_secret_post")) return "client_secret_post"
  return
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

function oidcBasicCredentialsEncode(clientId: string, clientSecret: string): string {
  const bytes = new TextEncoder().encode(`${clientId}:${clientSecret}`)
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}
