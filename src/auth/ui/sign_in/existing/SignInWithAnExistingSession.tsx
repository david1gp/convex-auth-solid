import type { UserSession } from "@/auth/model/UserSession"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { userSessionsSignal } from "@/auth/ui/signals/userSessionsSignal"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { useNavigate } from "@solidjs/router"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { For, Show } from "solid-js"
import { Button } from "~ui/interactive/button/Button"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { SolidRouterNavigator } from "~ui/utils/Navigator"

dayjs.extend(relativeTime)

export interface SignInWithAnExistingSessionProps extends MayHaveClass {
  h2Class?: string
}

export function SignInWithAnExistingSession(p: SignInWithAnExistingSessionProps) {
  const sessions = userSessionsSignal.get
  return (
    <Show when={sessions().length > 0}>
      <section
        class={classMerge(
          "space-y-4 max-w-2xl",
          sessions().length > 4 ? "row-span-3" : sessions().length > 2 ? "row-span-2" : "",
          p.class,
        )}
      >
        <h2 class={classMerge("text-xl font-semibold", p.h2Class)}>Continue with an existing session</h2>
        <div class="flex flex-col gap-4">
          <For each={sessions()}>{(session: UserSession) => <SessionButton session={session} />}</For>
        </div>
      </section>
    </Show>
  )
}

export interface SessionButtonProps extends MayHaveClass {
  session: UserSession
}

function SessionButton(p: SessionButtonProps) {
  const navigate = useNavigate() as SolidRouterNavigator
  return (
    <Button
      variant={buttonVariant.outline}
      class="flex items-center p-4 border-gray-300 dark:border-gray-500"
      onClick={() => sessionOnClick(navigate, p.session)}
    >
      <div class="flex items-center gap-3 w-full">
        <SessionImage user={p.session.user} />
        <div class="text-left">
          <div class="text-lg">{p.session.user.name}</div>
          {p.session.user.email && <div class="text-muted-foreground">{p.session.user.email}</div>}
          <div class="text-muted-foreground">signed in: {dayjs(p.session.signedInAt).fromNow()}</div>
        </div>
      </div>
    </Button>
  )
}

function sessionOnClick(navigate: SolidRouterNavigator, session: UserSession) {
  userSessionSignal.set(session)
  const url = urlSignInRedirectUrl()
  navigate(url)
}

function SessionImage(p: { user: UserSession["user"] }) {
  return (
    <Show when={p.user.image} fallback={<SessionImageFallback name={p.user.name} />}>
      <img src={p.user.image!} alt={p.user.name} class="w-10 h-10 rounded-full object-cover" />
    </Show>
  )
}

function SessionImageFallback(p: { name: string }) {
  return (
    <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
      <span class="">{p.name.charAt(0).toUpperCase()}</span>
    </div>
  )
}
