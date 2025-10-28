import type { UserSession } from "@/auth/model/UserSession"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { mdiAccount } from "@mdi/js"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { CorvuPopover } from "~ui/interactive/popover/CorvuPopover"
import { linkIcons } from "~ui/static/icon/linkIcons"

export function UserNavButton() {
  return <Show when={userSessionSignal.get()}>{(userSession) => <UserPopover />}</Show>
}

function UserPopover() {
  function onClick() {
    userSessionSignal.set(null)
  }
  return (
    <CorvuPopover icon={mdiAccount} variant={buttonVariant.ghost} title={ttt("My Account")}>
      <UserSessionInfo userSession={userSessionSignal.get()!} />
      <ButtonIcon icon={linkIcons.exit} onClick={onClick} variant={buttonVariant.link}>
        {ttt("Logout")}
      </ButtonIcon>
    </CorvuPopover>
  )
}

function UserSessionInfo(p: { userSession: UserSession }) {
  return (
    <div class="ml-3">
      <p class="text-muted-foreground">{ttt("Signed in as")}</p>
      <p>{p.userSession.user.name}</p>
      <p class="">{p.userSession.user.email}</p>
    </div>
  )
}
