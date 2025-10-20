import { debounce } from "@solid-primitives/scheduled"
import { For, Show, onCleanup, onMount } from "solid-js"
import * as v from "valibot"
import { AuthLegalAgree } from "~auth/ui/sign_in/legal/AuthLegalAgree"
import { authLegalAgreeVariant } from "~auth/ui/sign_in/legal/authLegalAgreeVariant"
import { isDevEnvVite } from "~auth/ui/utils/isDevEnvVite"
import { InputS } from "~ui/input/input/InputS"
import { Label } from "~ui/input/label/Label"
import { LabelAsterix } from "~ui/input/label/LabelAsterix"
import { Button } from "~ui/interactive/button/Button"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { Checkbox } from "~ui/interactive/check/Checkbox"
import type { MayHaveClass } from "~ui/utils/ui/MayHaveClass"
import { classMerge } from "~ui/utils/ui/classMerge"
import { createSignalObject } from "~ui/utils/ui/createSignalObject"
import { emailSchema, passwordSchema, signUpNameSchema, signUpTermsSchema } from "../../model/emailSchema"
import { createSignUpUiState } from "./SignUpUiState"

type SignUpFormData = {
  name: string
  email: string
  password: string
  terms: boolean
}

interface SignUpEmailPasswordFormProps extends MayHaveClass {
  onSubmit: (values: SignUpFormData) => void
}

export function SignUpEmailPasswordForm(p: SignUpEmailPasswordFormProps) {
  const state = createSignUpUiState()

  function fillTestData() {
    state.name.set("Test Name")
    state.email.set("test@example.com")
    state.password.set("121212121212")
    state.terms.set(true)
  }

  if (isDevEnvVite()) {
    onMount(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.altKey && e.key === "t") {
          e.preventDefault()
          fillTestData()
        }
      }
      document.addEventListener("keydown", handleKeyDown)
      onCleanup(() => {
        document.removeEventListener("keydown", handleKeyDown)
      })
    })
  }

  const errors = (() => {
    const errorSignals = {
      name: createSignalObject<string>(""),
      email: createSignalObject<string>(""),
      password: createSignalObject<string>(""),
      terms: createSignalObject<string>(""),
    }
    return errorSignals
  })()

  const debounceMs = 250

  const validateOnChange = (field: keyof SignUpFormData) => {
    return debounce((value: string | boolean) => {
      const result = validateField(field, value)
      const errorSig = errors[field as keyof typeof errors]
      if (result.success) {
        errorSig.set("")
      } else {
        errorSig.set(result.issues[0].message)
      }
    }, debounceMs)
  }

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    state.isSubmitting.set(true)

    const formData: SignUpFormData = {
      name: state.name.get(),
      email: state.email.get(),
      password: state.password.get(),
      terms: state.terms.get(),
    }

    // Validate all fields
    const nameResult = validateField("name", formData.name)
    const emailResult = validateField("email", formData.email)
    const passwordResult = validateField("password", formData.password)
    const termsResult = validateField("terms", formData.terms)

    if (!nameResult.success) errors.name.set(nameResult.issues[0].message)
    else errors.name.set("")
    if (!emailResult.success) errors.email.set(emailResult.issues[0].message)
    else errors.email.set("")
    if (!passwordResult.success) errors.password.set(passwordResult.issues[0].message)
    else errors.password.set("")
    if (!termsResult.success) errors.terms.set(termsResult.issues[0].message)
    else errors.terms.set("")

    if (nameResult.success && emailResult.success && passwordResult.success && termsResult.success) {
      p.onSubmit(formData)
    }
    state.isSubmitting.set(false)
  }

  const fieldNames: (keyof SignUpFormData)[] = ["name", "email", "password", "terms"]

  return (
    <form onSubmit={handleSubmit} autocomplete="on" class={classMerge("flex flex-col gap-6", p.class)}>
      <For each={fieldNames}>{(field) => FieldSwitch(field, state, errors, validateOnChange)}</For>

      <Button
        type="submit"
        size={buttonSize.lg}
        variant={buttonVariant.primary}
        class="h-12 text-lg"
        disabled={state.isSubmitting.get()}
      >
        {state.isSubmitting.get() ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  )
}

function validateField(field: keyof SignUpFormData, value: string | boolean) {
  let schema
  if (field === "name") {
    schema = signUpNameSchema
  } else if (field === "email") {
    schema = emailSchema
  } else if (field === "password") {
    schema = passwordSchema
  } else if (field === "terms") {
    schema = signUpTermsSchema
    return v.safeParse(schema, value as boolean)
  }
  return v.safeParse(schema!, value as string)
}

function FieldSwitch(
  field: keyof SignUpFormData,
  state: ReturnType<typeof createSignUpUiState>,
  errors: { [K in keyof SignUpFormData]: { get: () => string; set: (value: string) => void } },
  validateOnChange: (field: keyof SignUpFormData) => (value: string | boolean) => void,
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
          valueSignal.set(e.currentTarget.value)
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
