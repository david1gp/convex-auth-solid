import { debounce } from "@solid-primitives/scheduled"
import * as a from "valibot"
import { authSignInDemoStoreGet } from "#src/auth/ui/sign_in/authSignInDemoStoreGet.ts"
import { emailSchema } from "#src/utils/valibot/emailSchema.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"

export function signInViaEmailDemoStateCreate() {
  const state = { email: createSignalObject(authSignInDemoStoreGet().email.get()) }
  const errors = { email: createSignalObject("") }
  const isSubmitting = createSignalObject(false)
  const validate = (value: string) => {
    const result = a.safeParse(emailSchema, value)
    errors.email.set(result.success ? "" : (result.issues[0]?.message ?? "Invalid email"))
    return result.success
  }
  return {
    state,
    errors,
    isSubmitting,
    hasErrors: () => !!errors.email.get(),
    fillTestData: () => state.email.set("demo@example.com"),
    validateOnChange: (_field: "email") =>
      debounce((value: string) => {
        validate(value)
      }, 0),
    handleSubmit: (e: SubmitEvent) => {
      e.preventDefault()
      if (!validate(state.email.get())) return
      authSignInDemoStoreGet().email.set(state.email.get())
      authSignInDemoStoreGet().message.set("Demo code sent. Continue to the code entry demo.")
    },
  }
}
