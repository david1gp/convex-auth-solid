import { ttc } from "#src/app/i18n/ttc.ts"
import { userSessionSignal } from "#src/auth/ui/signals/userSessionSignal.ts"
import { userSessionsSignal } from "#src/auth/ui/signals/userSessionsSignal.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { ButtonIcon } from "#ui/interactive/button/ButtonIcon.jsx"
import type { MayHaveButtonVariant } from "#ui/utils/MayHaveButtonVariant.ts"
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren.ts"
import type { MayHaveIcon } from "#ui/utils/MayHaveIcon.ts"

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
