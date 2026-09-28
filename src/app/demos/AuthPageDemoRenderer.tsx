import { Match, Switch } from "solid-js"
import { authPageDemoRendererStateCreate } from "#src/app/demos/authPageDemoRendererStateCreate.ts"
import { SignInErrorView } from "#src/auth/ui/sign_in/error/SignInErrorView.tsx"
import { SignInPageContent } from "#src/auth/ui/sign_in/page/SignInPageContent.tsx"
import { SignInViaEmailEnterOtpView } from "#src/auth/ui/sign_in/via_email_enter_otp/SignInViaEmailEnterOtpView.tsx"
import { classesBgGray } from "#ui/classes/classesBg.jsx"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.jsx"
import { classArr } from "#ui/utils/classArr.ts"

/** Opt-in renderer for exactly three auth routes; undefined for all other page demos. */
export function AuthPageDemoRenderer(p: { route: string }) {
  const state = authPageDemoRendererStateCreate()
  return (
    <Switch>
      <Match when={p.route === "/sign-in"}>
        <div class={classArr("min-h-dvh w-full", classesBgGray)}>
          <SignInPageContent demo />
          <p role="status">{state.store.message.get()}</p>
          <nav aria-label="Sign-in demos" class="flex gap-4 p-4">
            <LinkButtonInternal to={state.otpHref}>Enter sign-in code demo</LinkButtonInternal>
            <LinkButtonInternal to={state.errorHref}>Sign-in error demo</LinkButtonInternal>
          </nav>
        </div>
      </Match>
      <Match when={p.route === "/sign-in-enter-otp"}>
        <SignInViaEmailEnterOtpView actionFn={state.confirm} initialEmail={state.store.email.get()} />
        <p role="status">{state.store.message.get()}</p>
        <nav aria-label="Sign-in demos" class="flex gap-4 p-4">
          <LinkButtonInternal to={state.signInHref}>Sign-in demo</LinkButtonInternal>
          <LinkButtonInternal to={state.errorHref}>Sign-in error demo</LinkButtonInternal>
        </nav>
      </Match>
      <Match when={p.route === "/sign-in-error"}>
        <SignInErrorView
          errorMessage={state.store.message.get() || "Demo authentication failed. No real sign-in was attempted."}
          signInHref={state.signInHref}
        />
        <LinkButtonInternal to={state.otpHref}>Enter sign-in code demo</LinkButtonInternal>
      </Match>
    </Switch>
  )
}
