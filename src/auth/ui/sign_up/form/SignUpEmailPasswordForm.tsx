import { AuthLegalAgree } from "@/auth/ui/sign_in/legal/AuthLegalAgree"
import { authLegalAgreeVariant } from "@/auth/ui/sign_in/legal/authLegalAgreeVariant"
import { addKeyboardListenerAlt } from "@/auth/ui/sign_up/form/addKeyboardListenerAlt"
import { isDevEnvVite } from "@/utils/ui/isDevEnvVite"
import type { SearchParamsObject } from "@/utils/ui/router/SearchParamsObject"
import { useSearchParamsObject } from "@/utils/ui/router/useSearchParamsObject"
import { useNavigate } from "@solidjs/router"
import { For, Show } from "solid-js"
import type { JSX } from "solid-js/jsx-runtime"
import { ttt } from "~ui/i18n/ttt"
import { InputS } from "~ui/input/input/InputS"
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
  type SignUpErrorState,
  type SignUpFormField,
  type SignUpUiState,
} from "./signUpCreateStateManagement"

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
      <For each={fieldNames}>
        {(field) => FieldSwitch(field, sm.state, sm.errors, sm.validateOnChange, searchParams)}
      </For>

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

function FieldSwitch(
  field: SignUpFormField,
  state: SignUpUiState,
  errors: SignUpErrorState,
  validateOnChange: (field: SignUpFormField) => (value: string | boolean) => void,
  searchParams: SearchParamsObject,
) {
  if (field === signUpFormField.terms) {
    return FieldSwitchTerms(state, errors, validateOnChange)
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
    name: state.name,
    email: state.email,
    pw: state.pw,
  } as const satisfies Record<FormInputField, SignalObject<string>>

  const valueSignal = valueSignals[field]

  const autoCompleteValues = {
    name: "name",
    email: "email",
    pw: "new-password",
  } as const satisfies Record<FormInputField, JSX.HTMLAutocomplete>

  const autoComplete = autoCompleteValues[field]

  const debouncedValidate = validateOnChange(field)

  return (
    <div class="flex flex-col gap-2">
      <Label for={field} class={isRequired ? "flex items-center gap-1" : ""}>
        {labelText}
        {isRequired && <LabelAsterix />}
      </Label>
      <InputS
        id={field}
        name={field}
        type={inputType}
        autocomplete={autoComplete}
        placeholder={placeholder}
        valueSignal={valueSignal}
        class={classMerge(
          "",
          errors[field as keyof typeof errors].get() && "border-destructive focus-visible:ring-destructive",
        )}
        onInput={(e) => {
          const newValue = e.currentTarget.value
          valueSignal.set(newValue)
          if (field === "email") {
            searchParams.set({ email: newValue })
          }
          debouncedValidate(newValue)
        }}
        onBlur={(e) => {
          debouncedValidate(e.currentTarget.value)
        }}
      />
      <Show when={errors[field as keyof typeof errors].get()}>
        <p class="text-destructive">{errors[field as keyof typeof errors].get()}</p>
      </Show>
    </div>
  )
}

function FieldSwitchTerms(
  state: SignUpUiState,
  errors: SignUpErrorState,
  validateOnChange: (field: SignUpFormField) => (value: string | boolean) => void,
) {
  return (
    <Checkbox
      id={signUpFormField.terms}
      checked={state.terms.get()}
      onChange={(checked) => {
        state.terms.set(checked)
        validateOnChange(signUpFormField.terms)(checked)
      }}
    >
      <AuthLegalAgree variant={authLegalAgreeVariant.signUp} />
      <Show when={errors.terms.get()}>
        <span id="terms-error" class="text-red-500 block">
          {errors.terms.get()}
        </span>
      </Show>
    </Checkbox>
  )
}
