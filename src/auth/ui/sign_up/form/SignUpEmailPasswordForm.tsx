import { AuthLegalAgree } from "@/auth/ui/sign_in/legal/AuthLegalAgree"
import { authLegalAgreeVariant } from "@/auth/ui/sign_in/legal/authLegalAgreeVariant"
import { addKeyboardListenerAlt } from "@/auth/ui/sign_up/form/addKeyboardListenerAlt"
import { isDevEnvVite } from "@/utils/ui/isDevEnvVite"
import type { SearchParamsObject } from "@/utils/ui/router/SearchParamsObject"
import { useSearchParamsObject } from "@/utils/ui/router/useSearchParamsObject"
import { useNavigate } from "@solidjs/router"
import { For, Show } from "solid-js"
import { InputS } from "~ui/input/input/InputS"
import { Label } from "~ui/input/label/Label"
import { LabelAsterix } from "~ui/input/label/LabelAsterix"
import { Button } from "~ui/interactive/button/Button"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { Checkbox } from "~ui/interactive/check/Checkbox"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"
import { createSignUpUiState, signUpCreateStateManagement, type SignUpFormData } from "./signUpCreateStateManagement"

interface SignUpEmailPasswordFormProps extends MayHaveClass {}

export function SignUpEmailPasswordForm(p: SignUpEmailPasswordFormProps) {
  const navigate = useNavigate()
  const searchParams = useSearchParamsObject()
  const sm = signUpCreateStateManagement(navigate, searchParams)

  if (isDevEnvVite()) {
    addKeyboardListenerAlt("t", sm.fillTestData)
  }

  const fieldNames: (keyof SignUpFormData)[] = ["name", "email", "password", "terms"]

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
        disabled={sm.state.isSubmitting.get()}
      >
        {sm.state.isSubmitting.get() ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  )
}

function FieldSwitch(
  field: keyof SignUpFormData,
  state: ReturnType<typeof createSignUpUiState>,
  errors: { [K in keyof SignUpFormData]: { get: () => string; set: (value: string) => void } },
  validateOnChange: (field: keyof SignUpFormData) => (value: string | boolean) => void,
  searchParams: SearchParamsObject,
) {
  if (field === "terms") {
    return FieldSwitchTerms(state, errors, validateOnChange)
  }

  const isRequired = true
  const placeholder = `${field.charAt(0).toUpperCase() + field.slice(1)}`
  const labelText = field === "email" ? "Email" : field === "name" ? "Name" : "Password"
  const type = field === "password" ? "password" : "text"
  const valueSignal = field === "name" ? state.name : field === "email" ? state.email : state.password
  const autoComplete = field === "password" ? "new-password" : "name"

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
        type={type}
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
  state: ReturnType<typeof createSignUpUiState>,
  errors: { [K in keyof SignUpFormData]: { get: () => string; set: (value: string) => void } },
  validateOnChange: (field: keyof SignUpFormData) => (value: string | boolean) => void,
) {
  return (
    <Checkbox
      id="terms"
      checked={state.terms.get()}
      onChange={(checked) => {
        state.terms.set(checked)
        validateOnChange("terms")(checked)
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
