import { enableSignInDev } from "#src/app/config/enableSignInDev.ts"
import { ttc } from "#src/app/i18n/ttc.ts"
import { AuthSectionCard } from "#src/auth/ui/shared/AuthSectionCard.tsx"
import { urlAuthDev } from "#src/auth/url/urlAuthProvider.ts"
import { urlSignInRedirectUrl } from "#src/auth/url/urlSignInRedirectUrl.ts"
import { FormFieldInput } from "#src/ui/form/FormFieldInput.tsx"
import { navigateTo } from "#src/utils/router/navigateTo.ts"
import { formMode } from "#ui/input/form/formMode.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import { classArr } from "#ui/utils/classArr.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { mdiAccountHardHat } from "@mdi/js"

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
    <LinkButton href={getDevUrl()} variant={buttonVariant.filledIndigo} class={p.class}>
      {text}
    </LinkButton>
  )
}

function getDevUrl() {
  const currentUrl = urlSignInRedirectUrl()
  return urlAuthDev(userIdInputSignal.get(), currentUrl)
}
