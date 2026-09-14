import { loginProvider } from "#src/auth/model_field/socialLoginProvider.ts"
import type { OidcIdTokenClaims } from "#src/auth/server/oidc/oidcIdTokenClaimsSchema.ts"
import type { CommonAuthProvider } from "#src/auth/server/social_identity_providers/CommonAuthProvider.ts"

export function oidcTrustedProfileCreate(
  claims: OidcIdTokenClaims,
): Extract<CommonAuthProvider, { provider: typeof loginProvider.oidc }> {
  return {
    provider: loginProvider.oidc,
    issuer: claims.iss,
    providerId: claims.sub,
    givenName: claims.given_name ?? claims.name ?? "",
    familyName: claims.family_name ?? "",
    image: claims.picture ?? "",
    username: claims.preferred_username ?? "",
    email: claims.email_verified === true ? (claims.email ?? "") : "",
  }
}
