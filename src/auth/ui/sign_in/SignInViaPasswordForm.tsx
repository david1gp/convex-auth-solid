import { mdiLogin } from "@mdi/js"
import { debounce } from "@solid-primitives/scheduled"
import { Show } from "solid-js"
import * as v from "valibot"
import { InputS } from "~ui/input/input/InputS"
import { inputMaxLength50, urlMaxLength } from "~ui/input/input/inputMaxLength"
import { Label } from "~ui/input/label/Label"
import { LabelAsterix } from "~ui/input/label/LabelAsterix"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import type { MayHaveClass } from "~ui/utils/ui/MayHaveClass"
import { classMerge } from "~ui/utils/ui/classMerge"
import { emailSchema, passwordSchema } from "../../model/emailSchema"
import { createSignInUiState } from "./SignInUiState"

export function SignInViaPasswordForm(p: MayHaveClass) {
  const state = createSignInUiState()

  const validateEmail = (value: string) => {
    const result = v.safeParse(emailSchema, value)
    if (result.success) {
      state.emailError.set("")
      return true
    } else {
      const message = result.issues[0]?.message || "Invalid email"
      state.emailError.set(message)
      return false
    }
  }

  const validatePassword = (value: string) => {
    const result = v.safeParse(passwordSchema, value)
    if (result.success) {
      state.passwordError.set("")
      return true
    } else {
      const message = result.issues[0]?.message || "Invalid password"
      state.passwordError.set(message)
      return false
    }
  }

  const debounceMs = 250

  const debouncedValidateEmail = debounce((value: string) => {
    validateEmail(value)
  }, debounceMs)

  const debouncedValidatePassword = debounce((value: string) => {
    validatePassword(value)
  }, debounceMs)

  const handleEmailInput = () => {
    debouncedValidateEmail(state.email.get())
  }

  const handlePasswordInput = () => {
    debouncedValidatePassword(state.password.get())
  }

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    const emailValid = validateEmail(state.email.get())
    const passwordValid = validatePassword(state.password.get())
    if (emailValid && passwordValid) {
      state.isSubmitting.set(true)
      // Empty function - will be integrated later
      console.log("Sign in via password submitted", {
        email: state.email.get(),
        password: state.password.get(),
        rememberMe: state.rememberMe.get(),
      })
      state.isSubmitting.set(false)
    }
  }

  const emailInputId = "sign-in-via-password-email-input"
  const pwInputId = "sign-in-via-password-pw-input"

  const showRememberMe = false

  return (
    <form onSubmit={handleSubmit} autocomplete="on" class={classMerge("flex flex-col gap-4", p.class)}>
      <div class="flex flex-col gap-2">
        <Label for={emailInputId}>
          Email <LabelAsterix />
        </Label>
        <InputS
          id={emailInputId}
          type="email"
          placeholder="Enter your email"
          autocomplete={"email"}
          valueSignal={state.email}
          onInput={handleEmailInput}
          class={classMerge("w-full", state.emailError.get() ? "border-red-500" : "")}
          maxLength={inputMaxLength50}
        />
        <Show when={state.emailError.get()}>
          <p class="text-sm text-red-500">{state.emailError.get()}</p>
        </Show>
      </div>
      <div class="flex flex-col gap-2">
        <Label for={pwInputId}>
          Password <LabelAsterix />
        </Label>
        <InputS
          id={pwInputId}
          type="password"
          placeholder="Enter your password"
          autocomplete="current-password"
          valueSignal={state.password}
          onInput={handlePasswordInput}
          class={classMerge("w-full", state.passwordError.get() ? "border-red-500" : "")}
          maxLength={urlMaxLength}
        />
        <Show when={state.passwordError.get()}>
          <p class="text-sm text-red-500">{state.passwordError.get()}</p>
        </Show>
      </div>
      {showRememberMe && (
        <label class="flex items-center space-x-2">
          <input
            type="checkbox"
            id={"rememberMe"}
            checked={state.rememberMe.get()}
            onChange={(e) => state.rememberMe.set(e.currentTarget.checked)}
            class="rounded"
          />
          <span class="text-sm text-muted-foreground">Remember me on this device</span>
        </label>
      )}
      <ButtonIcon
        type="submit"
        disabled={state.isSubmitting.get()}
        icon={mdiLogin}
        // size={buttonSize.lg}
        variant={buttonVariant.primary}
        class="w-full"
      >
        {state.isSubmitting.get() ? "Signing in..." : "Sign in via Password"}
      </ButtonIcon>
    </form>
  )
}
