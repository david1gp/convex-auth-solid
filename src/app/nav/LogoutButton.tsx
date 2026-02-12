import { autoLoginIfUserRoleOnly, userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { userSessionsSignal } from "@/auth/ui/signals/userSessionsSignal"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { linkIcons } from "~ui/static/icon/linkIcons"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface LogoutButtonProps extends MayHaveClass {
  text?: string
}

export function LogoutButton(p: LogoutButtonProps) {
  function onClick() {
    userSessionSignal.set(null)
    const autoLogin = autoLoginIfUserRoleOnly()
    if (autoLogin) {
      userSessionsSignal.set([])
    }
  }
  return (
    <ButtonIcon icon={linkIcons.exit} onClick={onClick} variant={buttonVariant.link} class={p.class}>
      {p.text ?? ttt("Logout")}
    </ButtonIcon>
  )
}
