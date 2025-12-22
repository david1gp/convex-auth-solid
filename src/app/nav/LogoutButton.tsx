import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { linkIcons } from "~ui/static/icon/linkIcons"

export function LogoutButton() {
  function onClick() {
    userSessionSignal.set(null)
  }
  return (
    <ButtonIcon icon={linkIcons.exit} onClick={onClick} variant={buttonVariant.link}>
      {ttt("Logout")}
    </ButtonIcon>
  )
}
