import { posthogIdentify } from "#src/app/posthog/posthog.js"
import type { UserSession } from "#src/auth/model/UserSession.js"
import { userSessionSignal } from "#src/auth/ui/signals/userSessionSignal.js"

export function signInSessionExisting(newSession: UserSession) {
  userSessionSignal.set(newSession)
  posthogIdentify(newSession)
}
