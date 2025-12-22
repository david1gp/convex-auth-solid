import { posthogIdentify } from "@/app/posthog/posthog"
import type { UserSession } from "@/auth/model/UserSession"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { userSessionsSignalAdd } from "@/auth/ui/signals/userSessionsSignal"

export function signInSessionNew(newSession: UserSession) {
  userSessionsSignalAdd(newSession)
  userSessionSignal.set(newSession)
  posthogIdentify(newSession)
}
