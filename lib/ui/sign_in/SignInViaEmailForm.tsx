import { mdiLogin } from "@mdi/js"
import { debounce } from "@solid-primitives/scheduled"
import { useLocation, useNavigate } from "@solidjs/router"
import { Show, type Component } from "solid-js"
import * as v from "valibot"
import { apiClientSignInViaEmail } from "~auth/api/apiClient"
import { urlSignInEnterOtp } from "~auth/url/urlSignInEnterOtp"
import { urlSignInRedirectUrl } from "~auth/url/urlSignInRedirectUrl"
import { InputS } from "~ui/input/input/InputS"
import { inputMaxLength50 } from "~ui/input/input/inputMaxLength"
import { Label } from "~ui/input/label/Label"
import { LabelAsterix } from "~ui/input/label/LabelAsterix"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import type { MayHaveClass } from "~ui/utils/ui/MayHaveClass"
import { classMerge } from "~ui/utils/ui/classMerge"
import type { SignalObject } from "~ui/utils/ui/createSignalObject"
import { createSignalObject } from "~ui/utils/ui/createSignalObject"
import { emailSchema } from "../../model/emailSchema"

export type SignInUiState = {
  email: SignalObject<string>
  rememberMe: SignalObject<boolean>
  isSubmitting: SignalObject<boolean>
  emailError: SignalObject<string>
}

export function createSignInUiState(): SignInUiState {
  return {
    email: createSignalObject(""),
    rememberMe: createSignalObject(false),
    isSubmitting: createSignalObject(false),
    emailError: createSignalObject(""),
  }
}

export const SignInViaEmailForm: Component<MayHaveClass> = (p) => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = createSignInUiState()

  const debounceMs = 250

  const validateEmailDebounced = debounce((value: string) => {
    const result = v.safeParse(emailSchema, value)
    if (result.success) {
      state.emailError.set("")
    } else {
      state.emailError.set(result.issues[0].message)
    }
  }, debounceMs)

  const validateEmailImmediate = (value: string) => {
    const result = v.safeParse(emailSchema, value)
    if (result.success) {
      state.emailError.set("")
      return true
    } else {
      state.emailError.set(result.issues[0].message)
      return false
    }
  }

  const handleEmailInput = (e: InputEvent) => {
    const value = (e.target as HTMLInputElement).value
    state.email.set(value)
    validateEmailDebounced(value)
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    const email = state.email.get()
    const emailValid = validateEmailImmediate(email)
    if (!emailValid) return

    // Empty function - will be integrated later
    console.log("Sign in via email submitted", {
      email: state.email.get(),
      rememberMe: state.rememberMe.get(),
    })

    state.isSubmitting.set(true)
    const result = await apiClientSignInViaEmail({ email })
    if (!result.success) {
      toastAdd({ title: "Error signing in", description: result.errorMessage })
      return
    }
    state.isSubmitting.set(false)

    const returnPath = urlSignInRedirectUrl(location.pathname)
    const url = urlSignInEnterOtp(email, "", returnPath)
    navigate(url)
  }

  const emailInputId = "sign-in-via-email-input"

  const showRememberMe = false

  return (
    <form onSubmit={handleSubmit} autocomplete="on" class={classMerge("space-y-4", p.class)}>
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
          class={classMerge(
            "w-full",
            // layout
            state.emailError.get() ? "border-red-500" : "", // state
          )}
          maxLength={inputMaxLength50}
        />
        <Show when={state.emailError.get()}>
          <p class="text-sm text-red-500">{state.emailError.get()}</p>
        </Show>
      </div>
      {showRememberMe && (
        <label class="flex items-center space-x-2">
          <input
            id={"rememberMe"}
            type="checkbox"
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
        {state.isSubmitting.get() ? "Signing in..." : "Sign in via Email"}
      </ButtonIcon>
    </form>
  )
}
