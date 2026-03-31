import { accessBlocked } from "#src/app/layout/accessUnlocked.ts"
import { LayoutWrapperConvex } from "#src/app/layout/LayoutWrapperConvex.tsx"
import { AccessBlocked } from "#src/auth/ui/locked/AccessBlocked.tsx"
import { SignInPageLoader } from "#src/auth/ui/sign_in/page/SignInPageLoader.tsx"
import { userSessionSignal } from "#src/auth/ui/signals/userSessionSignal.ts"
import { userSessionsSignalRegisterHandler } from "#src/auth/ui/signals/userSessionsSignal.ts"
import type { MayHaveChildren } from "#ui/utils/MayHaveChildren.ts"
import type { MayHaveTitle } from "#ui/utils/MayHaveTitle.ts"
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
