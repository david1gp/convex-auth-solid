import type { DocUser } from "@/auth/convex/IdUser"
import type { UserProfile } from "@/auth/model/UserProfile"
import type { OrgRole } from "@/org/org_model_field/orgRole"

export function docUserToUserProfile(u: DocUser, orgHandle?: string, orgRole?: OrgRole): UserProfile {
  const {
    // filter convex internal fields
    _id,
    _creationTime,
    // filter private fields
    hashedPassword,
    // handle optional fields
    image,
    email,
    // rest
    ...rest
  } = u
  const profile: UserProfile = { userId: _id as string, ...rest }
  if (image) profile.image = image
  if (email) profile.email = email
  if (orgHandle) profile.orgHandle = orgHandle
  if (orgRole) profile.orgRole = orgRole
  return profile
}
