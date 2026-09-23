import { mdiAccountHardHat } from "@adaptive-ds/mdi/mdiAccountHardHat.js"
import { enableSignInAdmin } from "#src/app/config/enableSignInAdmin.ts"
import { ttc } from "#src/app/i18n/ttc.ts"
import { AuthSectionCard } from "#src/auth/ui/shared/AuthSectionCard.tsx"
import { urlAuthAdmin } from "#src/auth/url/urlAuthProvider.ts"
import { urlSignInRedirectUrl } from "#src/auth/url/urlSignInRedirectUrl.ts"
import { FormFieldInput } from "#src/ui/form/FormFieldInput.tsx"
import { navigateTo } from "#src/utils/router/navigateTo.ts"
import { formMode } from "#ui/input/form/formMode.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButtonExternal } from "#ui/interactive/link/LinkButton.jsx"
import { classArr } from "#ui/utils/classArr.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

export function AdminLoginSection(p: MayHaveClass) {
  if (!enableSignInAdmin()) return null

  return (
    <AuthSectionCard icon={mdiAccountHardHat} title={ttc("Admin")} subtitle={ttc("In dev mode only")}>
      <form
        //
        id="adminSignInForm"
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
        <AdminLoginButton />
      </form>
    </AuthSectionCard>
  )
}

function onSubmitFn(e: SubmitEvent) {
  e.preventDefault()
  const url = getAdminUrl()
  console.log("userId", userIdInputSignal.get())
  console.log("url", url)
  navigateTo(url)
}

const userIdInputSignal = createSignalObject("adaptive-sm")

function AdminLoginButton(p: MayHaveClass) {
  const text = ttc("Sign in")
  return (
    <LinkButtonExternal href={getAdminUrl()} variant={buttonVariant.filledIndigo} class={p.class}>
      {text}
    </LinkButtonExternal>
  )
}

function getAdminUrl() {
  const currentUrl = urlSignInRedirectUrl()
  return urlAuthAdmin(userIdInputSignal.get(), currentUrl)
}
