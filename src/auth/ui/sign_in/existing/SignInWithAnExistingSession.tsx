import type { UserSession } from "@/auth/model/UserSession"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { userSessionsSignal } from "@/auth/ui/signals/userSessionsSignal"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { navigateTo } from "@/utils/router/navigateTo"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { For, Show, type JSX } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { Button } from "~ui/interactive/button/Button"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { classesCardWrapper } from "~ui/static/container/classesCardWrapper"
import { classArr } from "~ui/utils/classArr"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveInnerClass } from "~ui/utils/MayHaveInnerClass"

dayjs.extend(relativeTime)

export interface SignInWithAnExistingSessionProps extends MayHaveInnerClass, MayHaveClass {
  h2Class?: string
  fallback?: JSX.Element
}

export function SignInWithAnExistingSession(p: SignInWithAnExistingSessionProps) {
  const sessions = userSessionsSignal.get
  return (
    <Show when={sessions().length > 0} fallback={p.fallback}>
      <section
        class={classMerge(
          // "space-y-4 max-w-2xl",
          // sessions().length > 4 ? "row-span-3" : sessions().length > 2 ? "row-span-2" : "",
          p.class,
        )}
      >
        <h2 class={classMerge("text-xl font-semibold", p.h2Class)}>{ttt("Continue with an earlier session")}</h2>
        <div class={p.innerClass ?? "contents"}>
          <For each={sessions()}>{(session: UserSession) => <SessionButton session={session} />}</For>
          <Button variant={buttonVariant.subtle} onClick={deleteAllSessions}>
            {ttt("Delete earlier sessions")}
          </Button>
        </div>
      </section>
    </Show>
  )
}

export interface SessionButtonProps extends MayHaveClass {
  session: UserSession
}

function SessionButton(p: SessionButtonProps) {
  return (
    <Button
      variant={buttonVariant.outline}
      class={classArr(
        //
        "flex items-center p-4",
        classesCardWrapper,
      )}
      onClick={() => sessionOnClick(p.session)}
    >
      <div class="flex items-center gap-3 w-full">
        <SessionImage user={p.session.profile} />
        <div class="text-left">
          <div class="text-lg">{p.session.profile.name}</div>
          {p.session.profile.email && <div class="text-muted-foreground">{p.session.profile.email}</div>}
          <div class="text-muted-foreground">signed in: {dayjs(p.session.signedInAt).fromNow()}</div>
        </div>
      </div>
    </Button>
  )
}

function sessionOnClick(session: UserSession) {
  userSessionSignal.set(session)
  const url = urlSignInRedirectUrl()
  navigateTo(url)
}

function SessionImage(p: { user: UserSession["profile"] }) {
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

function deleteAllSessions() {
  userSessionsSignal.set([])
}
