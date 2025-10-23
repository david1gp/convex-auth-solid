import { appName } from "@/app/text/appName"
import type { UserSession } from "@/auth/model/UserSession"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { mdiAccount } from "@mdi/js"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { CorvuPopover } from "~ui/interactive/popover/CorvuPopover"
import { ThemeButton } from "~ui/interactive/theme/ThemeButton"
import { linkIcons } from "~ui/static/icon/linkIcons"
import { LogoImageOnly } from "~ui/static/logo/LogoImageOnly"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface NavAppProps extends MayHaveChildren, MayHaveClass {}

export function NavApp(p: NavAppProps) {
  return (
    <nav class={classMerge("flex flex-wrap justify-between gap-4 mx-auto", "w-full max-w-7xl", p.class)}>
      <div class="flex flex-wrap">
        <LogoImageOnly />
        <p class="text-lg font-semibold flex items-center">{appName()}</p>
      </div>
      {p.children}
      {/*{Object.values(routeName).filter(name => !routePathRelative[name].includes(":")).map(name => <A href={routePathRelative[name]} class={c}>{name}</A>)}*/}
      <div class="flex flex-wrap">
        <ThemeButton />
        <LogoutButton />
      </div>
    </nav>
  )
}

function LogoutButton() {
  return <Show when={userSessionSignal.get()}>{(userSession) => <UserButton />}</Show>
}

function UserButton() {
  function onClick() {
    userSessionSignal.set(null)
  }
  return (
    <CorvuPopover icon={mdiAccount} variant={buttonVariant.ghost} title={ttt("My Account")}>
      <UserSessionInfo userSession={userSessionSignal.get()!} />
      <ButtonIcon icon={linkIcons.exit} onClick={onClick} variant={buttonVariant.link}>
        Logout
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
