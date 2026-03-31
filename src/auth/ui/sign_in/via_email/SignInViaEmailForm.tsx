import { ttc } from "#src/app/i18n/ttc.ts"
import { addKeyboardListenerAlt } from "#src/auth/ui/sign_up/form/addKeyboardListenerAlt.ts"
import { FormFieldInput } from "#src/ui/form/FormFieldInput.tsx"
import { formFieldConfigs } from "#src/ui/form/formFieldConfigs.ts"
import { isDevEnv } from "#src/utils/env/isDevEnv.ts"
import { createUrl } from "#src/utils/router/createUrl.ts"
import { searchParamSet } from "#src/utils/router/searchParamSet.ts"
import { formMode } from "#ui/input/form/formMode.ts"
import { ButtonIcon } from "#ui/interactive/button/ButtonIcon.jsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { classMerge } from "#ui/utils/classMerge.ts"
import { onMount, type Component } from "solid-js"
import { createSignInViaEmailStateManagement } from "./createSignInViaEmailStateManagement.js"

export const SignInViaEmailForm: Component<MayHaveClass> = (p) => {
  let url: URL | null = null
  onMount(() => {
    url = createUrl()
  })
  const sm = createSignInViaEmailStateManagement()
  if (isDevEnv()) {
    addKeyboardListenerAlt("t", sm.fillTestData)
  }
  return (
    <form onSubmit={sm.handleSubmit} autocomplete="on" class={classMerge("space-y-4", p.class)}>
      <FormFieldInput
        config={{
          ...formFieldConfigs.email,
          name: "Sign-in-via-email-email",
          labelClass: "sr-only",
          placeholder: () => ttc("Email"),
          required: true,
        }}
        value={sm.state.email.get()}
        error={sm.errors.email.get()}
        mode={formMode.add}
        onInput={(value) => {
          sm.state.email.set(value)
          sm.validateOnChange("email")(value)
          if (url) {
            searchParamSet("email", value)
          }
        }}
        onBlur={(value) => sm.validateOnChange("email")(value)}
      />
      <ButtonIcon
        type="submit"
        isLoading={sm.isSubmitting.get()}
        variant={sm.hasErrors() ? buttonVariant.filledRed : buttonVariant.filledIndigo}
        class="w-full"
      >
        {sm.isSubmitting.get() ? ttc("Sending link...") : ttc("Send link")}
      </ButtonIcon>
    </form>
  )
}
