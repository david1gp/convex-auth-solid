import { createLocalJWKSet, type JSONWebKeySet, jwtVerify } from "jose"
import * as a from "valibot"
import { createResult, createResultError, type PromiseResult, resultTryParsingFetchErr } from "#result"
import type { OidcConfig } from "#src/auth/server/oidc/oidcConfig.ts"
import type { OidcDiscovery } from "#src/auth/server/oidc/oidcDiscoverySchema.ts"
import { type OidcIdTokenClaims, oidcIdTokenClaimsSchema } from "#src/auth/server/oidc/oidcIdTokenClaimsSchema.ts"
import { oidcJwksSchema } from "#src/auth/server/oidc/oidcJwksSchema.ts"

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

type OidcIdTokenVerifyInput = {
  config: OidcConfig
  discovery: OidcDiscovery
  idToken: string
  nonce: string
  currentDate?: Date
}

export async function oidcIdTokenVerify(input: OidcIdTokenVerifyInput): PromiseResult<OidcIdTokenClaims> {
  const op = "oidcIdTokenVerify"
  if (input.discovery.issuer !== input.config.issuer) return createResultError(op, "OIDC discovery issuer mismatch")
  if (!input.idToken || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/u.test(input.idToken)) {
    return createResultError(op, "missing or invalid OIDC ID token")
  }
  if (!input.nonce || !/^[A-Za-z0-9._~-]{1,128}$/u.test(input.nonce)) {
    return createResultError(op, "missing or invalid OIDC nonce")
  }
  if (!oidcHttpsUrlIsValid(input.discovery.jwks_uri)) return createResultError(op, "invalid OIDC JWKS endpoint")
  const algorithms = input.discovery.id_token_signing_alg_values_supported.filter((algorithm) =>
    oidcAllowedSigningAlgorithms.has(algorithm),
  )
  if (algorithms.length === 0) return createResultError(op, "no supported OIDC ID-token signing algorithm")

  let response: Response
  let text: string
  try {
    response = await fetch(input.discovery.jwks_uri, { headers: { Accept: "application/json" } })
    text = await response.text()
  } catch {
    return createResultError(op, "could not fetch OIDC JWKS")
  }
  if (!response.ok) return resultTryParsingFetchErr(op, text, response.status, response.statusText)

  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    return createResultError(op, "invalid OIDC JWKS JSON")
  }
  const jwksResult = a.safeParse(oidcJwksSchema, json)
  if (!jwksResult.success) return createResultError(op, "invalid OIDC JWKS")

  const currentDate = input.currentDate ?? new Date()
  if (!Number.isFinite(currentDate.getTime())) return createResultError(op, "invalid OIDC verification date")

  let verified: Awaited<ReturnType<typeof jwtVerify<OidcIdTokenClaims>>>
  try {
    verified = await jwtVerify<OidcIdTokenClaims>(
      input.idToken,
      createLocalJWKSet(jwksResult.output as JSONWebKeySet),
      {
        algorithms,
        audience: input.config.clientId,
        issuer: input.discovery.issuer,
        currentDate,
        clockTolerance: 60,
        requiredClaims: ["iss", "sub", "aud", "exp", "iat", "nonce"],
      },
    )
  } catch {
    return createResultError(op, "OIDC ID-token signature or claims verification failed")
  }

  const claimsResult = a.safeParse(oidcIdTokenClaimsSchema, verified.payload)
  if (!claimsResult.success) return createResultError(op, "invalid verified OIDC ID-token claims")
  const claims = claimsResult.output
  if (claims.iss !== input.discovery.issuer) return createResultError(op, "OIDC ID-token issuer mismatch")
  if (claims.nonce !== input.nonce) return createResultError(op, "OIDC ID-token nonce mismatch")
  if (claims.sub.trim() === "") return createResultError(op, "OIDC ID-token subject is empty")
  if (claims.azp !== undefined && claims.azp !== input.config.clientId) {
    return createResultError(op, "OIDC ID-token authorized party mismatch")
  }
  if (Array.isArray(claims.aud) && claims.aud.length > 1 && claims.azp === undefined) {
    return createResultError(op, "OIDC ID-token authorized party mismatch")
  }
  if (!Number.isFinite(claims.iat) || !Number.isFinite(claims.exp) || claims.exp <= claims.iat) {
    return createResultError(op, "invalid OIDC ID-token time claims")
  }

  const nowSeconds = Math.floor(currentDate.getTime() / 1000)
  if (claims.iat > nowSeconds + 60) return createResultError(op, "invalid OIDC ID-token time claims")
  return createResult(claims)
}

function oidcHttpsUrlIsValid(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash
  } catch {
    return false
  }
}
