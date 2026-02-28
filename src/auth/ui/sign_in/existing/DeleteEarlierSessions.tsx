import { ttc } from "@/app/i18n/ttc"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { userSessionsSignal } from "@/auth/ui/signals/userSessionsSignal"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import type { MayHaveButtonVariant } from "~ui/utils/MayHaveButtonVariant"
import type { MayHaveClassAndChildren } from "~ui/utils/MayHaveClassAndChildren"
import type { MayHaveIcon } from "~ui/utils/MayHaveIcon"

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
