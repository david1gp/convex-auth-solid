import type { DocUser } from "#src/auth/convex/IdUser.js"
import type { UserProfile } from "#src/auth/model/UserProfile.js"
import type { OrgRole } from "#src/org/org_model_field/orgRole.js"

export function docUserToUserProfile(u: DocUser, orgHandle?: string, orgRole?: OrgRole): UserProfile {
  const {
    // filter convex internal fields
    _id,
    _creationTime,
    // filter private fields
    hashedPassword,
    // rest
    ...rest
  } = u
  const profile: UserProfile = { userId: _id as string, ...rest }
  if (orgHandle) profile.orgHandle = orgHandle
  if (orgRole) profile.orgRole = orgRole
  return profile
}
