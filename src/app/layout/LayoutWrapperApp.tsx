import { accessBlocked } from "#src/app/layout/accessUnlocked.js"
import { LayoutWrapperConvex } from "#src/app/layout/LayoutWrapperConvex.js"
import { AccessBlocked } from "#src/auth/ui/locked/AccessBlocked.js"
import { SignInPageLoader } from "#src/auth/ui/sign_in/page/SignInPageLoader.js"
import { userSessionSignal } from "#src/auth/ui/signals/userSessionSignal.js"
import { userSessionsSignalRegisterHandler } from "#src/auth/ui/signals/userSessionsSignal.js"
import type { MayHaveChildren } from "#ui/utils/MayHaveChildren"
import type { MayHaveTitle } from "#ui/utils/MayHaveTitle"
import { Match, Switch } from "solid-js"

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
