import { mdiLogin } from "@mdi/js"
import { useLocation, useNavigate } from "@solidjs/router"
import { Show, type Component } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { InputS } from "~ui/input/input/InputS"
import { inputMaxLength50 } from "~ui/input/input/inputMaxLength"
import { Label } from "~ui/input/label/Label"
import { LabelAsterix } from "~ui/input/label/LabelAsterix"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"
import { createSignInViaEmailStateManagement } from "./signInViaEmailCreateUiState"

export const SignInViaEmailForm: Component<MayHaveClass> = (p) => {
  const navigate = useNavigate()
  const location = useLocation()
  const sm = createSignInViaEmailStateManagement(navigate, location)
  const emailInputId = "sign-in-via-email-input"
  return (
    <form onSubmit={sm.handleSubmit} autocomplete="on" class={classMerge("space-y-4", p.class)}>
      <div class="flex flex-col gap-2">
        <Label for={emailInputId}>
          Email <LabelAsterix />
        </Label>
        <InputS
          id={emailInputId}
          type="email"
          placeholder={ttt("Enter your email")}
          autocomplete={"email"}
          valueSignal={sm.state.email}
          onInput={(e) => {
            sm.state.email.set(e.currentTarget.value)
            sm.validateOnChange("email")(e.currentTarget.value)
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
