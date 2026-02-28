import type { UserSession } from "@/auth/model/UserSession"
import { userRoleIsDevOrAdmin } from "@/auth/model_field/userRole"

const log = false

export function accessUnlocked(session: UserSession | undefined | null) {
  if (!session || !session.profile) {
    if (log) console.info("!session", "-> access blocked")
    return false
  }
  if (userRoleIsDevOrAdmin(session.profile.role)) {
    if (log) console.info("role check -> access granted")
    return true
  }
  const inOrg = !!session.profile.orgHandle && !!session.profile.orgRole
  if (!inOrg) {
    if (log)
      console.info(
        "!inOrg -> access blocked",
        { orgHandle: session.profile.orgHandle, orgRole: session.profile.orgRole },
        session,
      )
  }
  return inOrg
}

export function accessBlocked(session: UserSession | undefined | null) {
  return !accessUnlocked(session)
}
