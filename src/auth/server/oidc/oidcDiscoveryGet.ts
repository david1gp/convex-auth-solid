import * as a from "valibot"
import { createResult, createResultError, type PromiseResult, resultTryParsingFetchErr } from "#result"
import type { OidcConfig } from "#src/auth/server/oidc/oidcConfig.ts"
import { type OidcDiscovery, oidcDiscoverySchema } from "#src/auth/server/oidc/oidcDiscoverySchema.ts"

const oidcAllowedSigningAlgorithms = new Set([
  "RS256",
  "RS384",
  "RS512",
  "PS256",
  "PS384",
  "PS512",
  "ES256",
  "ES384",
  "ES512",
  "EdDSA",
])

export async function oidcDiscoveryGet(config: OidcConfig): PromiseResult<OidcDiscovery> {
  const op = "oidcDiscoveryGet"
  if (!oidcHttpsUrlIsValid(config.issuer)) return createResultError(op, "invalid OIDC issuer URL")

  let discoveryUrl: URL
  try {
    discoveryUrl = new URL(
      ".well-known/openid-configuration",
      config.issuer.endsWith("/") ? config.issuer : `${config.issuer}/`,
    )
  } catch {
    return createResultError(op, "invalid OIDC discovery URL")
  }

  let response: Response
  let text: string
  try {
    response = await fetch(discoveryUrl, { headers: { Accept: "application/json" } })
    text = await response.text()
  } catch {
    return createResultError(op, "could not fetch OIDC discovery metadata")
  }
  if (!response.ok) return resultTryParsingFetchErr(op, text, response.status, response.statusText)

  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    return createResultError(op, "invalid OIDC discovery JSON")
  }
  const parsed = a.safeParse(oidcDiscoverySchema, json)
  if (!parsed.success) return createResultError(op, "invalid OIDC discovery metadata")
  const discovery = parsed.output

  if (discovery.issuer !== config.issuer) return createResultError(op, "OIDC discovery issuer mismatch")
  if (!discovery.response_types_supported.includes("code")) {
    return createResultError(op, "OIDC discovery does not support authorization code flow")
  }
  if (
    discovery.id_token_signing_alg_values_supported.every((algorithm) => !oidcAllowedSigningAlgorithms.has(algorithm))
  ) {
    return createResultError(op, "OIDC discovery has no supported ID-token signing algorithm")
  }

  const endpointValues = [
    discovery.authorization_endpoint,
    discovery.token_endpoint,
    discovery.jwks_uri,
    discovery.userinfo_endpoint,
  ]
  if (endpointValues.some((endpoint) => endpoint !== undefined && !oidcHttpsUrlIsValid(endpoint))) {
    return createResultError(op, "invalid OIDC discovery endpoint URL")
  }

  return createResult(discovery)
}

function oidcHttpsUrlIsValid(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash
  } catch {
    return false
  }
}
