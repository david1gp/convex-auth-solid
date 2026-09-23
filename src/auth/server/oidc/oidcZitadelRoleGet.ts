import { type UserRole, userRole } from "#src/auth/model_field/userRole.ts"
import type { OidcIdTokenClaims } from "#src/auth/server/oidc/oidcIdTokenClaimsSchema.ts"

const trustedRolePrecedence = ["admin", "user"] as const

export function oidcZitadelRoleGet(
  projectRoles: OidcIdTokenClaims["urn:zitadel:iam:org:project:roles"],
  organizationId: string,
): UserRole {
  for (const role of trustedRolePrecedence) {
    if (!projectRoles?.some((roleGrant) => Object.hasOwn(roleGrant[role] ?? {}, organizationId))) continue
    if (role === "user") return userRole.user
    return userRole.admin
  }
  return userRole.user
}
