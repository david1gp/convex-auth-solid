import { enableSignInDev } from "@/app/config/enableSignInDev"
import { ttc } from "@/app/i18n/ttc"
import { AuthSectionCard } from "@/auth/ui/shared/AuthSectionCard"
import { urlAuthDev } from "@/auth/url/urlAuthProvider"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { FormFieldInput } from "@/ui/form/FormFieldInput"
import { navigateTo } from "@/utils/router/navigateTo"
import { mdiAccountHardHat } from "@mdi/js"
import { formMode } from "~ui/input/form/formMode"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { classArr } from "~ui/utils/classArr"
import { createSignalObject } from "~ui/utils/createSignalObject"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export function DevLoginSection(p: MayHaveClass) {
  if (!enableSignInDev()) return null

  return (
    <AuthSectionCard icon={mdiAccountHardHat} title={ttc("Admin")} subtitle={ttc("In dev mode only")}>
      <form
        //
        id="devSignInForm"
        onSubmit={onSubmitFn}
        autocomplete="on"
        class={classArr("flex flex-col gap-4 w-full")}
      >
        <FormFieldInput
          config={{
            name: "user-id",
            label: () => ttc("User id"),
            labelClass: "sr-only",
            placeholder: () => ttc("User id / Username"),
            required: true,
            autocomplete: "username",
          }}
          value={userIdInputSignal.get()}
          error=""
          mode={formMode.edit}
          onInput={(value) => userIdInputSignal.set(value)}
          onBlur={() => {}}
        />
        <DevLoginButton />
      </form>
    </AuthSectionCard>
  )
}

function onSubmitFn(e: SubmitEvent) {
  e.preventDefault()
  const url = getDevUrl()
  console.log("userId", userIdInputSignal.get())
  console.log("url", url)
  navigateTo(url)
}

const userIdInputSignal = createSignalObject("adaptive-sm")

function DevLoginButton(p: MayHaveClass) {
  const text = ttc("Sign in")
  return (
    <LinkButton href={getDevUrl()} variant={buttonVariant.primary} class={p.class}>
      {text}
    </LinkButton>
  )
}

function getDevUrl() {
  const currentUrl = urlSignInRedirectUrl()
  return urlAuthDev(userIdInputSignal.get(), currentUrl)
}
