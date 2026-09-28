import * as a from "valibot"
import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"
import { signUpTermsSchema } from "#src/auth/model/signUpTermsSchema.ts"
import { passwordSchema } from "#src/auth/model_field/passwordSchema.ts"
import { emailSchema } from "#src/utils/valibot/emailSchema.ts"
import { stringSchemaName } from "#src/utils/valibot/stringSchema.ts"
import { createSignalObject, type SignalObject } from "#ui/utils/createSignalObject.ts"
import {
  createSignUpErrorState,
  type SignUpFormField,
  type SignUpUiStateManagement,
  signUpCreateFormState,
} from "./signUpCreateFormState.ts"

/** All inputs stay in memory; passwords are never saved to the cross-page fixture. */
export function signUpDemoStateCreate(): SignUpUiStateManagement {
  const state = signUpCreateFormState()
  const errors = createSignUpErrorState()
  const isSubmitting = createSignalObject(false)
  const store = pageDemoFixtureStoreGet()
  state.email.set(store.get<string>("auth.signUp.email") ?? "")

  function validate(field: SignUpFormField, value: string | boolean) {
    const schema =
      field === "name"
        ? stringSchemaName
        : field === "email"
          ? emailSchema
          : field === "pw"
            ? passwordSchema
            : signUpTermsSchema
    const result = a.safeParse(schema, value as never)
    errors[field].set(result.success ? "" : (result.issues[0]?.message ?? "Invalid value"))
    return result.success
  }

  return {
    state,
    errors,
    isSubmitting,
    hasErrors: () => Object.values(errors).some((error) => !!error.get()),
    fillTestData: () => {},
    validateOnChange: (field) =>
      ((value: string | boolean) => {
        validate(field, value)
      }) as ReturnType<SignUpUiStateManagement["validateOnChange"]>,
    handleSubmit: (event) => {
      event.preventDefault()
      const valid = (["name", "email", "pw", "terms"] as const)
        .map((field) => validate(field, state[field].get()))
        .every(Boolean)
      if (!valid) return
      store.set("auth.signUp.email", state.email.get())
      store.set("auth.signUp.name", state.name.get())
      store.set("auth.signUp.message", "Demo registration prepared. No account or confirmation email was created.")
      store
        .get<SignalObject<string>>("auth.signUp.messageSignal")
        ?.set("Demo registration prepared. No account or confirmation email was created.")
      state.pw.set("")
    },
  }
}
