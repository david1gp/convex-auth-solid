import { createResult, createResultError, type Result } from "#result"
import { envBaseUrlApiResult } from "#src/app/env/public/envBaseUrlApiResult.ts"
import { apiAuthBasePath } from "#src/auth/api_client/apiAuthBasePath.ts"
import { apiPathAuth } from "#src/auth/url/apiPathAuth.ts"

export function oidcCallbackUrlGet(): Result<string> {
  const op = "oidcCallbackUrlGet"
  const baseUrlResult = envBaseUrlApiResult()
  if (!baseUrlResult.success) return baseUrlResult

  try {
    const callbackUrl = new URL(apiAuthBasePath + apiPathAuth.signInViaOidcCallback, baseUrlResult.data)
    if (!oidcCallbackUrlIsValid(callbackUrl)) return createResultError(op, "invalid OIDC callback URL")
    return createResult(callbackUrl.toString())
  } catch {
    return createResultError(op, "invalid OIDC callback URL")
  }
}

function oidcCallbackUrlIsValid(value: URL): boolean {
  return (
    (value.protocol === "https:" || value.protocol === "http:") &&
    !value.username &&
    !value.password &&
    !value.search &&
    !value.hash
  )
}
