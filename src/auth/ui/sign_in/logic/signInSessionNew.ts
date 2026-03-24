import { posthogIdentify } from "#src/app/posthog/posthog.js"
import type { UserSession } from "#src/auth/model/UserSession.js"
import { userSessionSignal } from "#src/auth/ui/signals/userSessionSignal.js"
import { userSessionsSignalAdd } from "#src/auth/ui/signals/userSessionsSignal.js"

export function signInSessionNew(newSession: UserSession) {
  userSessionsSignalAdd(newSession)
  userSessionSignal.set(newSession)
  posthogIdentify(newSession)
}
