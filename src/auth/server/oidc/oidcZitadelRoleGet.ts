import { type UserRole, userRole } from "#src/auth/model_field/userRole.ts"
import type { OidcIdTokenClaims } from "#src/auth/server/oidc/oidcIdTokenClaimsSchema.ts"

export function oidcZitadelRoleGet(
  projectRoles: OidcIdTokenClaims["urn:zitadel:iam:org:project:roles"],
  organizationId: string,
): UserRole {
  const rolesByPriority: UserRole[] = [userRole.dev, userRole.admin, userRole.user]
  for (const role of rolesByPriority) {
    if (projectRoles?.some((roleGrant) => Object.hasOwn(roleGrant[role] ?? {}, organizationId))) return role
  }
  return userRole.user
}
