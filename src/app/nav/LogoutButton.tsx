import { autoLoginIfUserRoleOnly, userSessionSignal } from "#src/auth/ui/signals/userSessionSignal.js"
import { userSessionsSignal } from "#src/auth/ui/signals/userSessionsSignal.js"
import { ttt } from "#ui/i18n/ttt.js"
import { buttonVariant } from "#ui/interactive/button/buttonCva.js"
import { ButtonIcon } from "#ui/interactive/button/ButtonIcon.jsx"
import { linkIcons } from "#ui/static/icon/linkIcons.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"

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
