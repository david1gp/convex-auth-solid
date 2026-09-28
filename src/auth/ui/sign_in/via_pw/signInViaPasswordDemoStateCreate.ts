import { debounce } from "@solid-primitives/scheduled"
import * as a from "valibot"
import { passwordSchema } from "#src/auth/model_field/passwordSchema.ts"
import { authSignInDemoStoreGet } from "#src/auth/ui/sign_in/authSignInDemoStoreGet.ts"
import { emailSchema } from "#src/utils/valibot/emailSchema.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"

export function signInViaPasswordDemoStateCreate() {
  const state = {
    email: createSignalObject(authSignInDemoStoreGet().email.get()),
    password: createSignalObject(""),
    isSubmitting: createSignalObject(false),
  }
  const errors = { email: createSignalObject(""), password: createSignalObject("") }
  const validate = (field: "email" | "password", value: string) => {
    const result = a.safeParse(field === "email" ? emailSchema : passwordSchema, value)
    errors[field].set(result.success ? "" : (result.issues[0]?.message ?? "Invalid value"))
    return result.success
  }
  return {
    state,
    errors,
    hasErrors: () => !!errors.email.get() || !!errors.password.get(),
    fillTestData: () => {
      state.email.set("demo@example.com")
      state.password.set("demo-password-123")
    },
    validateOnChange: (field: "email" | "password") =>
      debounce((value: string) => {
        validate(field, value)
      }, 0),
    handleSubmit: (e: SubmitEvent) => {
      e.preventDefault()
      const emailValid = validate("email", state.email.get())
      const passwordValid = validate("password", state.password.get())
      if (!emailValid || !passwordValid) return
      authSignInDemoStoreGet().email.set(state.email.get())
      authSignInDemoStoreGet().message.set("Demo password submitted. No sign-in was attempted.")
    },
  }
}
