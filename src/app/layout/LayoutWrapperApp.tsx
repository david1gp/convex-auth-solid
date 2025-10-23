import { LayoutWrapperConvex } from "@/app/layout/LayoutWrapperConvex"
import { SignInPageLoader } from "@/auth/ui/sign_in/SignInPageLoader"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { Match, Switch } from "solid-js"
import type { HasChildren } from "~ui/utils/HasChildren"
import type { MayHaveTitle } from "~ui/utils/MayHaveTitle"

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
