import { posthog } from "posthog-js"
import { enablePosthog } from "#src/app/config/enablePosthog.ts"
import type { UserSession } from "#src/auth/model/UserSession.ts"

export function posthogIdentify(session: UserSession) {
  if (!enablePosthog()) {
    return
  }
  const user = session.profile
  const distinctId = user.email ?? user.username ?? user.userId
  posthog.identify(distinctId, user)
}
