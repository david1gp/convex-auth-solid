import { posthogIdentify } from "@/app/posthog/posthog"
import type { UserSession } from "@/auth/model/UserSession"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"

export function signInSessionExisting(newSession: UserSession) {
  userSessionSignal.set(newSession)
  posthogIdentify(newSession)
}
