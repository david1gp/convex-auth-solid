import { posthogIdentify } from "#src/app/posthog/posthog.ts"
import type { UserSession } from "#src/auth/model/UserSession.ts"
import { userSessionSignal } from "#src/auth/ui/signals/userSessionSignal.ts"

export function signInSessionExisting(newSession: UserSession) {
  userSessionSignal.set(newSession)
  posthogIdentify(newSession)
}
