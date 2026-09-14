import { createResult, createResultError, type Result } from "#result"
import { envVariableErrorMessage } from "#src/app/env/envVariableErrorMessage.ts"
import { privateEnvVariableName } from "#src/app/env/privateEnvVariableName.ts"
import type { OidcConfig } from "#src/auth/server/oidc/oidcConfig.ts"

const oidcDefaultScopes = ["openid", "profile", "email"] as const
const oidcScopeCharacterPattern = /^[\u0021\u0023-\u005B\u005D-\u007E]+$/u

export function oidcConfigGet(): Result<OidcConfig> {
  const op = "oidcConfigGet"
  const issuer = process.env[privateEnvVariableName.OIDC_ISSUER]?.trim()
  if (!issuer) return createResultError(op, envVariableErrorMessage(privateEnvVariableName.OIDC_ISSUER))
  if (!oidcHttpsUrlIsValid(issuer)) return createResultError(op, "invalid OIDC_ISSUER")

  const clientId = process.env[privateEnvVariableName.OIDC_CLIENT_ID]?.trim()
  if (!clientId) return createResultError(op, envVariableErrorMessage(privateEnvVariableName.OIDC_CLIENT_ID))

  const scopeText = process.env[privateEnvVariableName.OIDC_SCOPES]
  const scopes = scopeText === undefined ? [...oidcDefaultScopes] : scopeText.trim().split(/\s+/u)
  if (
    scopes.length === 0 ||
    scopes.some((scope) => !scope || !oidcScopeCharacterPattern.test(scope)) ||
    !scopes.includes("openid")
  ) {
    return createResultError(op, "invalid OIDC_SCOPES")
  }

  const clientSecret = process.env[privateEnvVariableName.OIDC_CLIENT_SECRET] || undefined
  return createResult({ issuer, clientId, clientSecret, scopes: [...new Set(scopes)] })
}

function oidcHttpsUrlIsValid(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash
  } catch {
    return false
  }
}
