import { AuthLegalAgree } from "@/auth/ui/sign_in/legal/AuthLegalAgree"
import { authLegalAgreeVariant } from "@/auth/ui/sign_in/legal/authLegalAgreeVariant"
import { addKeyboardListenerAlt } from "@/auth/ui/sign_up/form/addKeyboardListenerAlt"
import { isDevEnvVite } from "@/utils/ui/isDevEnvVite"
import { useSearchParamsObject } from "@/utils/ui/router/useSearchParamsObject"
import { useNavigate } from "@solidjs/router"
import { For, Show } from "solid-js"
import type { JSX } from "solid-js/jsx-runtime"
import { ttt } from "~ui/i18n/ttt"
import { Input } from "~ui/input/input/Input"
import { Label } from "~ui/input/label/Label"
import { LabelAsterix } from "~ui/input/label/LabelAsterix"
import { Button } from "~ui/interactive/button/Button"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { Checkbox } from "~ui/interactive/check/Checkbox"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"
import type { SignalObject } from "~ui/utils/createSignalObject"
import {
  signUpCreateStateManagement,
  signUpFormField,
  type SignUpFormField,
  type SignUpUiStateManagement,
} from "./signUpCreateFormState"

interface SignUpEmailPasswordFormProps extends MayHaveClass {}

export function SignUpEmailPasswordForm(p: SignUpEmailPasswordFormProps) {
  const navigate = useNavigate()
  const searchParams = useSearchParamsObject()
  const sm = signUpCreateStateManagement(navigate, searchParams)

  if (isDevEnvVite()) {
    addKeyboardListenerAlt("t", sm.fillTestData)
  }

  const fieldNames: SignUpFormField[] = Object.values(signUpFormField)

  return (
    <form onSubmit={sm.handleSubmit} autocomplete="on" class={classMerge("flex flex-col gap-6", p.class)}>
      <For each={fieldNames}>{(field) => FieldSwitch(field, sm)}</For>

      <Button
        type="submit"
        size={buttonSize.lg}
        variant={sm.hasErrors() ? buttonVariant.destructive : buttonVariant.primary}
        class="text-lg"
        disabled={sm.isSubmitting.get()}
      >
        {sm.isSubmitting.get() ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  )
}

function FieldSwitch(field: SignUpFormField, sm: SignUpUiStateManagement) {
  if (field === signUpFormField.terms) {
    return FieldSwitchTerms(sm)
  }
  type FormInputField = Exclude<SignUpFormField, "terms">

  const isRequired = true

  const labelTexts = {
    name: ttt("Name"),
    email: ttt("Email"),
    pw: ttt("Password"),
  } as const satisfies Record<FormInputField, string>
  const labelText = labelTexts[field]
  const placeholder = labelText

  const inputType = field === signUpFormField.pw ? "password" : "text"

  const valueSignals = {
    name: sm.state.name,
    email: sm.state.email,
    pw: sm.state.pw,
  } as const satisfies Record<FormInputField, SignalObject<string>>

  const valueSignal = valueSignals[field]

  const autoCompleteValues = {
    name: "name",
    email: "email",
    pw: "new-password",
  } as const satisfies Record<FormInputField, JSX.HTMLAutocomplete>

  const autoComplete = autoCompleteValues[field]

  const debouncedValidate = sm.validateOnChange(field)

  return (
    <div class="flex flex-col gap-2">
      <Label for={field} class={isRequired ? "flex items-center gap-1" : ""}>
        {labelText}
        {isRequired && <LabelAsterix />}
      </Label>
      <Input
        id={field}
        name={field}
        type={inputType}
        autocomplete={autoComplete}
        placeholder={placeholder}
        value={valueSignal.get()}
        class={classMerge(
          "",
          sm.errors[field as keyof typeof sm.errors].get() && "border-destructive focus-visible:ring-destructive",
        )}
        onInput={(e) => {
          const newValue = e.currentTarget.value
          valueSignal.set(newValue)
          if (field === "email") {
            sm.searchParams.set({ email: newValue })
          }
          debouncedValidate(newValue)
        }}
        onBlur={(e) => {
          debouncedValidate(e.currentTarget.value)
        }}
      />
      <Show when={sm.errors[field as keyof typeof sm.errors].get()}>
        <p class="text-destructive">{sm.errors[field as keyof typeof sm.errors].get()}</p>
      </Show>
    </div>
  )
}

function FieldSwitchTerms(sm: SignUpUiStateManagement) {
  return (
    <Checkbox
      id={signUpFormField.terms}
      checked={sm.state.terms.get()}
      onChange={(checked) => {
        sm.state.terms.set(checked)
        sm.validateOnChange(signUpFormField.terms)(checked)
      }}
    >
      <AuthLegalAgree variant={authLegalAgreeVariant.signUp} />
      <Show when={sm.errors.terms.get()}>
        <span id="terms-error" class="text-red-500 block">
          {sm.errors.terms.get()}
        </span>
      </Show>
    </Checkbox>
  )
}
