const defaultOidcSignInLabel = "Sign in with SSO"

export function oidcSignInLabel(): string {
  const label = process.env.PUBLIC_OIDC_LABEL?.trim()
  return label || defaultOidcSignInLabel
}
