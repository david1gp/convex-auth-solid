import { autoLoginIfUserRoleOnly, userSessionSignal } from "#src/auth/ui/signals/userSessionSignal.ts"
import { userSessionsSignal } from "#src/auth/ui/signals/userSessionsSignal.ts"
import { ttt } from "#ui/i18n/ttt.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { ButtonIcon } from "#ui/interactive/button/ButtonIcon.jsx"
import { linkIcons } from "#ui/static/icon/linkIcons.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

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
