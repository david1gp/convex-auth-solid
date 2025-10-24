import { urlAuthDev } from "@/auth/url/urlAuthProvider"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { isDevEnvVite } from "@/utils/ui/isDevEnvVite"
import { useNavigate } from "@solidjs/router"
import { inputMaxLength50 } from "~ui/input/input/inputMaxLength"
import { InputS } from "~ui/input/input/InputS"
import { Label } from "~ui/input/label/Label"
import { LabelAsterix } from "~ui/input/label/LabelAsterix"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { classesCardWrapperP4 } from "~ui/static/container/classesCardWrapper"
import { linkIcons } from "~ui/static/icon/linkIcons"
import { classMerge } from "~ui/utils/classMerge"
import { createSignalObject } from "~ui/utils/createSignalObject"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export function DevLoginSection(p: MayHaveClass) {
  if (!isDevEnvVite()) return null

  const userIdField = "user-id"

  return (
    <section class={classMerge("flex flex-col gap-4", p.class)}>
      <h2 class="text-xl font-semibold">Developer login</h2>
      <form
        id="devSignInForm"
        // class={classMerge("grid grid-cols-1 sm:grid-cols-2 gap-4 mx-auto", p.class)}
        class={classMerge(classesCardWrapperP4, "flex flex-col gap-4")}
        onSubmit={onSubmitFn}
        autocomplete="on"
      >
        <div class="flex flex-col gap-2">
          <Label for={userIdField}>
            User id <LabelAsterix />
          </Label>
          <InputS
            id={userIdField}
            valueSignal={userIdInputSignal}
            class="border-gray-300 dark:border-gray-500"
            maxLength={inputMaxLength50}
          />
        </div>
        <DevLoginButton />
      </form>
    </section>
  )
}

function onSubmitFn(e: SubmitEvent) {
  e.preventDefault()
  const nav = useNavigate()
  const url = getDevUrl()
  console.log("userId", userIdInputSignal.get())
  console.log("url", url)
  nav(url)
}

const userIdInputSignal = createSignalObject("adaptive-sm")

function DevLoginButton(p: MayHaveClass) {
  const text = "Sign in with user id"
  return (
    <LinkButton href={getDevUrl()} icon={linkIcons.login} variant={buttonVariant.destructive} class={p.class}>
      {text}
    </LinkButton>
  )
}

function getDevUrl() {
  const currentUrl = urlSignInRedirectUrl()
  return urlAuthDev(userIdInputSignal.get(), currentUrl)
}
