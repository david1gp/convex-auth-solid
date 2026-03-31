import { posthogIdentify } from "#src/app/posthog/posthog.ts"
import type { UserSession } from "#src/auth/model/UserSession.ts"
import { userSessionSignal } from "#src/auth/ui/signals/userSessionSignal.ts"
import { userSessionsSignalAdd } from "#src/auth/ui/signals/userSessionsSignal.ts"

export function signInSessionNew(newSession: UserSession) {
  userSessionsSignalAdd(newSession)
  userSessionSignal.set(newSession)
  posthogIdentify(newSession)
}
