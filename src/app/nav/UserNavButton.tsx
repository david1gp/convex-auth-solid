import { LogoutButton } from "@/app/nav/LogoutButton"
import type { UserSession } from "@/auth/model/UserSession"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { mdiAccount } from "@mdi/js"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { CorvuPopover } from "~ui/interactive/popover/CorvuPopover"

export function UserNavButton() {
  return <Show when={userSessionSignal.get()}>{(userSession) => <UserPopover />}</Show>
}

function UserPopover() {
  return (
    <CorvuPopover icon={mdiAccount} variant={buttonVariant.ghost} title={ttt("My Account")}>
      <UserSessionInfo userSession={userSessionSignal.get()!} />
      <LogoutButton />
    </CorvuPopover>
  )
}

function UserSessionInfo(p: { userSession: UserSession }) {
  return (
    <div class="ml-3">
      <p class="text-muted-foreground">{ttt("Signed in as")}</p>
      <p>{p.userSession.profile.name}</p>
      <p class="">{p.userSession.profile.email}</p>
    </div>
  )
}
