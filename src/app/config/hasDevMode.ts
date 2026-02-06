import { userRoleIsDev } from "@/auth/model_field/userRole"
import { userSessionsSignal } from "@/auth/ui/signals/userSessionsSignal"
import { isDevEnv } from "~ui/env/isDevEnv"

export function hasDevMode(): boolean {
  if (isDevEnv()) return true
  const sessions = userSessionsSignal.get()
  return sessions.some((s) => userRoleIsDev(s.profile.role))
}
