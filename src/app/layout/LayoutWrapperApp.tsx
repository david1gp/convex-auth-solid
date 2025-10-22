import { LayoutWrapperConvex } from "@/auth/ui/layout/LayoutWrapperConvex"
import { SignInPageLoader } from "@/auth/ui/sign_in/SignInPageLoader"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { Match, Switch } from "solid-js"
import type { HasChildren } from "~ui/utils/ui/HasChildren"
import type { MayHaveTitle } from "~ui/utils/ui/MayHaveTitle"

export interface LayoutWrapperAppProps extends HasChildren, MayHaveTitle {}

export function LayoutWrapperApp(p: LayoutWrapperAppProps) {
  return (
    <Switch>
      <Match when={!userSessionSignal.get()}>
        <SignInPageLoader />
      </Match>
      <Match when={true}>
        <LayoutWrapperConvex title={p.title}>{p.children}</LayoutWrapperConvex>
      </Match>
    </Switch>
  )
}
