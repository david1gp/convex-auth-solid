import { LogoutButton } from "@/app/nav/LogoutButton"
import type { UserSession } from "@/auth/model/UserSession"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { urlUserProfileMe } from "@/auth/url/pageRouteAuth"
import { mdiAccount } from "@mdi/js"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { CorvuPopoverIcon } from "~ui/interactive/popover/CorvuPopoverIcon"

export function UserNavButton() {
  return <Show when={userSessionSignal.get()}>{(userSession) => <UserPopover />}</Show>
}

function UserPopover() {
  return (
    <CorvuPopoverIcon
      icon={mdiAccount}
      variant={buttonVariant.ghost}
      title={ttt("My Account")}
      innerClass="flex flex-col gap-1"
    >
      <UserSessionInfo userSession={userSessionSignal.get()!} />
      <LinkButton icon={mdiAccount} variant={buttonVariant.link} href={urlUserProfileMe()} class="justify-start">
        {ttt("My Profile")}
      </LinkButton>
      )
      <LogoutButton class="justify-start" />
    </CorvuPopoverIcon>
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
