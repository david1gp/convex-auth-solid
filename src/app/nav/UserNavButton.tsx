import { LogoutButton } from "#src/app/nav/LogoutButton.tsx"
import type { UserSession } from "#src/auth/model/UserSession.ts"
import { userSessionSignal } from "#src/auth/ui/signals/userSessionSignal.ts"
import { urlUserProfileMe } from "#src/auth/url/pageRouteAuth.ts"
import { ttt } from "#ui/i18n/ttt.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import { CorvuPopoverIcon } from "#ui/interactive/popover/CorvuPopoverIcon.jsx"
import { mdiAccount } from "@mdi/js"
import { Show } from "solid-js"

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
