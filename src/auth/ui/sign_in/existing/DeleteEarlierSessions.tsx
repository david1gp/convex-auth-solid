import { ttc } from "#src/app/i18n/ttc.js"
import { userSessionSignal } from "#src/auth/ui/signals/userSessionSignal.js"
import { userSessionsSignal } from "#src/auth/ui/signals/userSessionsSignal.js"
import { buttonVariant } from "#ui/interactive/button/buttonCva.js"
import { ButtonIcon } from "#ui/interactive/button/ButtonIcon.jsx"
import type { MayHaveButtonVariant } from "#ui/utils/MayHaveButtonVariant.js"
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren.js"
import type { MayHaveIcon } from "#ui/utils/MayHaveIcon.js"

interface DeleteEarlierSessionsProps extends MayHaveIcon, MayHaveButtonVariant, MayHaveClassAndChildren {}

export function DeleteEarlierSessions(p: DeleteEarlierSessionsProps) {
  return (
    <ButtonIcon
      icon={p.icon}
      iconClass={p.iconClass}
      variant={p.variant ?? buttonVariant.subtle}
      onClick={deleteAllSessions}
    >
      {p.children ?? ttc("Delete earlier sessions")}
    </ButtonIcon>
  )
}

function deleteAllSessions() {
  userSessionSignal.set(null)
  userSessionsSignal.set([])

  // Remove userSession from URL params
  const url = new URL(window.location.href)
  url.searchParams.delete("userSession")
  window.history.replaceState({}, "", url)
}
