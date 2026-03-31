import { ttc } from "#src/app/i18n/ttc.ts"
import { addKeyboardListenerAlt } from "#src/auth/ui/sign_up/form/addKeyboardListenerAlt.ts"
import { FormFieldInput } from "#src/ui/form/FormFieldInput.tsx"
import { formFieldConfigs } from "#src/ui/form/formFieldConfigs.ts"
import { isDevEnv } from "#src/utils/env/isDevEnv.ts"
import { formMode } from "#ui/input/form/formMode.ts"
import { ButtonIcon } from "#ui/interactive/button/ButtonIcon.jsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { classMerge } from "#ui/utils/classMerge.ts"
import { signInViaPasswordCreateStateManagement } from "./signInViaPasswordCreateStateManagement.js"

export function SignInViaPasswordForm(p: MayHaveClass) {
  const sm = signInViaPasswordCreateStateManagement()
  if (isDevEnv()) {
    addKeyboardListenerAlt("t", sm.fillTestData)
  }

  return (
    <form onSubmit={sm.handleSubmit} autocomplete="on" class={classMerge("flex flex-col gap-4", p.class)}>
      <FormFieldInput
        config={{
          ...formFieldConfigs.email,
          name: "Sign-in-via-password-email",
          label: () => "Email",
          placeholder: () => "Email",
          labelClass: "sr-only",
          required: true,
        }}
        value={sm.state.email.get()}
        error={sm.errors.email.get()}
        mode={formMode.add}
        onInput={(value) => {
          sm.state.email.set(value)
          sm.validateOnChange("email")(value)
        }}
        onBlur={(value) => sm.validateOnChange("email")(value)}
      />
      <FormFieldInput
        config={{
          name: "password",
          label: () => ttc("Password"),
          labelClass: "sr-only",
          placeholder: () => ttc("Password"),
          type: "password",
          autocomplete: "current-password",
          required: true,
        }}
        value={sm.state.password.get()}
        error={sm.errors.password.get()}
        mode={formMode.add}
        onInput={(value) => {
          sm.state.password.set(value)
          sm.validateOnChange("password")(value)
        }}
        onBlur={(value) => sm.validateOnChange("password")(value)}
      />
      <ButtonIcon
        type="submit"
        isLoading={sm.state.isSubmitting.get()}
        variant={sm.hasErrors() ? buttonVariant.filledRed : buttonVariant.filledIndigo}
        class="w-full"
      >
        {sm.state.isSubmitting.get() ? ttc("Signing in...") : ttc("Sign in")}
      </ButtonIcon>
    </form>
  )
}
