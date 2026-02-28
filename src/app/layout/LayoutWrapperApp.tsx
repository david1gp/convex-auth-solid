import { accessBlocked } from "@/app/layout/accessUnlocked"
import { LayoutWrapperConvex } from "@/app/layout/LayoutWrapperConvex"
import { AccessBlocked } from "@/auth/ui/locked/AccessBlocked"
import { SignInPageLoader } from "@/auth/ui/sign_in/page/SignInPageLoader"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { userSessionsSignalRegisterHandler } from "@/auth/ui/signals/userSessionsSignal"
import { Match, Switch } from "solid-js"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import type { MayHaveTitle } from "~ui/utils/MayHaveTitle"

export interface LayoutWrapperAppProps extends MayHaveChildren, MayHaveTitle {}

export function LayoutWrapperApp(p: LayoutWrapperAppProps) {
  userSessionsSignalRegisterHandler()

  return (
    <Switch>
      <Match when={!userSessionSignal.get()}>
        <SignInPageLoader />
      </Match>
      <Match when={accessBlocked(userSessionSignal.get())}>
        <AccessBlocked />
      </Match>
      <Match when={true}>
        <LayoutWrapperConvex title={p.title}>{p.children}</LayoutWrapperConvex>
      </Match>
    </Switch>
  )
}
