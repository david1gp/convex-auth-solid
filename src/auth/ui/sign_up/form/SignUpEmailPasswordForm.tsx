import { AuthLegalAgree } from "@/auth/ui/sign_in/legal/AuthLegalAgree"
import { authLegalAgreeVariant } from "@/auth/ui/sign_in/legal/authLegalAgreeVariant"
import { addKeyboardListenerAlt } from "@/auth/ui/sign_up/form/addKeyboardListenerAlt"
import { FormFieldInput } from "@/ui/form/FormFieldInput"
import { formFieldConfigs } from "@/ui/form/formFieldConfigs"
import { isDevEnvVite } from "@/utils/ui/isDevEnvVite"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { Checkbox } from "~ui/input/check/Checkbox"
import { formMode } from "~ui/input/form/formMode"
import { Button } from "~ui/interactive/button/Button"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"
import { signUpCreateStateManagement, signUpFormField } from "./signUpCreateFormState"

interface SignUpEmailPasswordFormProps extends MayHaveClass {}

export function SignUpEmailPasswordForm(p: SignUpEmailPasswordFormProps) {
  const sm = signUpCreateStateManagement()

  if (isDevEnvVite()) {
    addKeyboardListenerAlt("t", sm.fillTestData)
  }

  const showRequired = false

  return (
    <form onSubmit={sm.handleSubmit} autocomplete="on" class={classMerge("flex flex-col gap-6", p.class)}>
      <FormFieldInput
        config={{
          ...formFieldConfigs.name,
          placeholder: "My Name",
          required: showRequired,
        }}
        value={sm.state.name.get()}
        error={sm.errors.name.get()}
        mode={formMode.add}
        onInput={(value) => {
          sm.state.name.set(value)
          sm.validateOnChange("name")(value)
        }}
        onBlur={(value) => sm.validateOnChange("name")(value)}
      />

      <FormFieldInput
        config={{
          ...formFieldConfigs.email,
          placeholder: "my.email@gmail.com",
          required: showRequired,
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
          label: ttt("Password"),
          placeholder: ttt("******"),
          type: "password",
          autocomplete: "new-password",
          required: showRequired,
        }}
        value={sm.state.pw.get()}
        error={sm.errors.pw.get()}
        mode={formMode.add}
        onInput={(value) => {
          sm.state.pw.set(value)
          sm.validateOnChange("pw")(value)
        }}
        onBlur={(value) => sm.validateOnChange("pw")(value)}
      />

      <Checkbox
        id={signUpFormField.terms}
        checked={sm.state.terms.get()}
        onChange={(checked) => {
          sm.state.terms.set(checked)
          sm.validateOnChange(signUpFormField.terms)(checked)
        }}
      >
        <AuthLegalAgree variant={authLegalAgreeVariant.explicit} class="ml-1" />
        <Show when={sm.errors.terms.get()}>
          <span id="terms-error" class="text-red-500 block">
            {sm.errors.terms.get()}
          </span>
        </Show>
      </Checkbox>

      <Button
        type="submit"
        variant={sm.hasErrors() ? buttonVariant.destructive : buttonVariant.primary}
        class="text-lg"
        disabled={sm.isSubmitting.get()}
      >
        {sm.isSubmitting.get() ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  )
}
