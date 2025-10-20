import type { DocUser } from "@convex/auth/IdUser"
import type { UserProfile } from "~auth/model/UserProfile"

export function dbUsersToUserProfile(u: DocUser): UserProfile {
  const { _id, _creationTime, hashedPassword, ...rest } = u
  const hasPw = !!hashedPassword
  return { userId: _id, hasPw, ...rest }
}
