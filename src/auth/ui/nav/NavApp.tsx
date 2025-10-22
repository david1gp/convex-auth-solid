import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { Show } from "solid-js"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { ThemeButton } from "~ui/interactive/theme/ThemeButton"
import { LogoImageOnly } from "~ui/static/logo/LogoImageOnly"
import { classMerge } from "~ui/utils/ui/classMerge"
import type { MayHaveChildren } from "~ui/utils/ui/MayHaveChildren"
import type { MayHaveClass } from "~ui/utils/ui/MayHaveClass"

export interface NavAppProps extends MayHaveChildren, MayHaveClass {}

export function NavApp(p: NavAppProps) {
  return (
    <nav class={classMerge("flex flex-wrap justify-between gap-4 mx-auto", "w-full max-w-7xl", p.class)}>
      <LogoImageOnly />
      {p.children}
      {/*{Object.values(routeName).filter(name => !routePathRelative[name].includes(":")).map(name => <A href={routePathRelative[name]} class={c}>{name}</A>)}*/}
      <ThemeButton />
      <LogoutButton />
    </nav>
  )
}

function LogoutButton() {
  function onClick() {
    userSessionSignal.set(null)
  }
  return (
    <Show when={userSessionSignal.get()}>
      {(userSession) => (
        <ButtonIcon onClick={onClick} variant={buttonVariant.link}>
          Logout
        </ButtonIcon>
      )}
    </Show>
  )
}
