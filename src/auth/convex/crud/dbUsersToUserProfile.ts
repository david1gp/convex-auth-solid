import type { DocUser } from "@/auth/convex/IdUser"
import type { UserProfile } from "@/auth/model/UserProfile"
import type { OrgRole } from "@/org/model/orgRole"

export function dbUsersToUserProfile(u: DocUser, orgHandle?: string, orgRole?: OrgRole): UserProfile {
  const { _id, _creationTime, hashedPassword, ...rest } = u
  const hasPw = !!hashedPassword
  const profile: UserProfile = { userId: _id, hasPw, ...rest }
  if (orgHandle) profile.orgHandle = orgHandle
  if (orgRole) profile.orgRole = orgRole
  return profile
}
