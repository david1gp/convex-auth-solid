import { Show } from "solid-js"
import { oidcSignInLabel } from "#src/app/config/oidcSignInLabel.ts"
import { classesAuthCard } from "#src/auth/ui/shared/classesAuthCard.ts"
import { allgroupsSsoPageStateCreate } from "#src/sso/model/allgroupsSsoPageStateCreate.ts"
import { Checkbox } from "#ui/input/check/Checkbox.tsx"
import { Button } from "#ui/interactive/button/Button.tsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { ThemeButton } from "#ui/interactive/theme/ThemeButton.tsx"
import { classArr } from "#ui/utils/classArr.ts"

export function AllgroupsSsoPage() {
  const state = allgroupsSsoPageStateCreate()

  return (
    <div class="relative grid min-h-dvh place-items-center overflow-hidden bg-slate-50 px-5 py-10 dark:bg-slate-950">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.12),transparent_35%)]" />
      <ThemeButton class="absolute right-5 top-5" />
      <main class={classArr("relative w-full max-w-md p-8 text-center sm:p-10", classesAuthCard)}>
        <span class="mx-auto grid size-14 place-items-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-500/25">
          A
        </span>
        <p class="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
          Allgroups Chat
        </p>
        <h1 class="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Single Sign-On</h1>
        <p class="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Sign in with your organization account. Existing identity-provider sessions are detected automatically.
        </p>
        <Show when={state.errorMessage()}>
          {(message) => (
            <div
              role="alert"
              class="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-left text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
            >
              <p class="font-semibold">Sign-in could not be completed.</p>
              <p class="mt-1">{message()}</p>
            </div>
          )}
        </Show>
        <div class="mt-8 flex flex-col gap-3">
          <Button
            variant={buttonVariant.filledIndigo}
            class="w-full! py-3!"
            onClick={state.loginClick}
            disabled={state.isPending()}
          >
            {oidcSignInLabel()}
          </Button>
        </div>
        <div class="mt-4 flex items-center justify-center">
          <Checkbox id="sso-auto-sign-in" checked={state.autoSignIn()} onChange={state.autoSignInToggle}>
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Sign in automatically</span>
          </Checkbox>
        </div>
        <p class="mt-5 text-xs text-slate-400">Secure OpenID Connect · no local password</p>
      </main>
    </div>
  )
}
