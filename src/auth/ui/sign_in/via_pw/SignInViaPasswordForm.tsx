import { addKeyboardListenerAlt } from "@/auth/ui/sign_up/form/addKeyboardListenerAlt"
import { isDevEnvVite } from "@/utils/ui/isDevEnvVite"
import { useSearchParamsObject } from "@/utils/ui/router/useSearchParamsObject"
import { mdiLogin } from "@mdi/js"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { InputS } from "~ui/input/input/InputS"
import { inputMaxLength50, urlMaxLength } from "~ui/input/input/inputMaxLength"
import { Label } from "~ui/input/label/Label"
import { LabelAsterix } from "~ui/input/label/LabelAsterix"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"
import { signInViaPasswordCreateStateManagement } from "./signInViaPasswordCreateStateManagement"

export function SignInViaPasswordForm(p: MayHaveClass) {
  const searchParams = useSearchParamsObject()
  const sm = signInViaPasswordCreateStateManagement(searchParams)
  const emailInputId = "sign-in-via-password-email-input"
  const pwInputId = "sign-in-via-password-pw-input"
  if (isDevEnvVite()) {
    addKeyboardListenerAlt("t", sm.fillTestData)
  }
  return (
    <form onSubmit={sm.handleSubmit} autocomplete="on" class={classMerge("flex flex-col gap-4", p.class)}>
      <div class="flex flex-col gap-2">
        <Label for={emailInputId}>
          Email <LabelAsterix />
        </Label>
        <InputS
          id={emailInputId}
          type="email"
          placeholder="Enter your email"
          autocomplete={"email"}
          valueSignal={sm.state.email}
          onInput={(e) => {
            const newValue = e.currentTarget.value
            sm.state.email.set(newValue)
            searchParams.set({ email: newValue })
            sm.validateOnChange("email")(newValue)
          }}
          onBlur={(e) => sm.validateOnChange("email")(e.currentTarget.value)}
          class={classMerge("w-full", sm.errors.email.get() && "border-destructive focus-visible:ring-destructive")}
          maxLength={inputMaxLength50}
        />
        <Show when={sm.errors.email.get()}>
          <p class="text-destructive">{sm.errors.email.get()}</p>
        </Show>
      </div>
      <div class="flex flex-col gap-2">
        <Label for={pwInputId}>
          {ttt("Password")}
          <LabelAsterix />
        </Label>
        <InputS
          id={pwInputId}
          type="password"
          placeholder="Enter your password"
          autocomplete="current-password"
          valueSignal={sm.state.password}
          onInput={(e) => {
            sm.state.password.set(e.currentTarget.value)
            sm.validateOnChange("password")(e.currentTarget.value)
          }}
          onBlur={(e) => sm.validateOnChange("password")(e.currentTarget.value)}
          class={classMerge("w-full", sm.errors.password.get() && "border-destructive focus-visible:ring-destructive")}
          maxLength={urlMaxLength}
        />
        <Show when={sm.errors.password.get()}>
          <p class="text-destructive">{sm.errors.password.get()}</p>
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
        {sm.state.isSubmitting.get() ? ttt("Signing in...") : ttt("Sign in via Password")}
      </ButtonIcon>
    </form>
  )
}
