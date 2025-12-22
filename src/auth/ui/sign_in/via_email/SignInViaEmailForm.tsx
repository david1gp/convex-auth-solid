import { addKeyboardListenerAlt } from "@/auth/ui/sign_up/form/addKeyboardListenerAlt"
import { FormFieldInput } from "@/ui/form/FormFieldInput"
import { formFieldConfigs } from "@/ui/form/formFieldConfigs"
import { isDevEnv } from "@/utils/env/isDevEnv"
import { createUrl } from "@/utils/router/createUrl"
import { searchParamSet } from "@/utils/router/searchParamSet"
import { onMount, type Component } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode } from "~ui/input/form/formMode"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"
import { createSignInViaEmailStateManagement } from "./createSignInViaEmailStateManagement"

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
          placeholder: ttt("Email"),
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
        variant={sm.hasErrors() ? buttonVariant.destructive : buttonVariant.primary}
        class="w-full"
      >
        {sm.isSubmitting.get() ? ttt("Sending link...") : ttt("Send link")}
      </ButtonIcon>
    </form>
  )
}
