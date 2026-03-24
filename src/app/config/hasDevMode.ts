import { userRoleIsDev } from "#src/auth/model_field/userRole.js"
import { userSessionsSignal } from "#src/auth/ui/signals/userSessionsSignal.js"
import { isDevEnv } from "#ui/env/isDevEnv.js"

export function hasDevMode(): boolean {
  if (isDevEnv()) return true
  const sessions = userSessionsSignal.get()
  return sessions.some((s) => userRoleIsDev(s.profile.role))
}
