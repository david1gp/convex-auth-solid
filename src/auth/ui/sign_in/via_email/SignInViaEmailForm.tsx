import { addKeyboardListenerAlt } from "@/auth/ui/sign_up/form/addKeyboardListenerAlt"
import { createUrl } from "@/utils/router/createUrl"
import { searchParamSet } from "@/utils/router/searchParamSet"
import { isDevEnvVite } from "@/utils/ui/isDevEnvVite"
import { inputMaxLength50 } from "@/utils/valibot/inputMaxLength"
import { mdiLogin } from "@mdi/js"
import { onMount, Show, type Component } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { Input } from "~ui/input/input/Input"
import { Label } from "~ui/input/label/Label"
import { LabelAsterix } from "~ui/input/label/LabelAsterix"
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
  if (isDevEnvVite()) {
    addKeyboardListenerAlt("t", sm.fillTestData)
  }
  const emailInputId = "sign-in-via-email-input"
  return (
    <form onSubmit={sm.handleSubmit} autocomplete="on" class={classMerge("space-y-4", p.class)}>
      <div class="flex flex-col gap-2">
        <Label for={emailInputId}>
          {ttt("Email")}
          <LabelAsterix />
        </Label>
        <Input
          id={emailInputId}
          type="email"
          placeholder={ttt("Enter your email")}
          autocomplete={"email"}
          value={sm.state.email.get()}
          onInput={(e) => {
            const newValue = e.currentTarget.value
            sm.state.email.set(newValue)
            sm.validateOnChange("email")(newValue)
            if (url) {
              searchParamSet("email", newValue)
            }
          }}
          onBlur={(e) => sm.validateOnChange("email")(e.currentTarget.value)}
          class={classMerge("w-full", sm.errors.email.get() && "border-destructive focus-visible:ring-destructive")}
          maxLength={inputMaxLength50}
        />
        <Show when={sm.errors.email.get()}>
          <p class="text-destructive">{sm.errors.email.get()}</p>
        </Show>
      </div>
      <ButtonIcon
        type="submit"
        disabled={sm.state.isSubmitting.get()}
        icon={mdiLogin}
        // size={buttonSize.lg}
        variant={sm.hasErrors() ? buttonVariant.destructive : buttonVariant.primary}
        class="w-full"
      >
        {sm.state.isSubmitting.get() ? ttt("Signing in...") : ttt("Sign in via Email")}
      </ButtonIcon>
    </form>
  )
}
