import { signInViaPasswordCreateStateManagement } from "#src/auth/ui/sign_in/via_pw/signInViaPasswordCreateStateManagement.ts"
import { addKeyboardListenerAlt } from "#src/auth/ui/sign_up/form/addKeyboardListenerAlt.ts"
import { isDevEnv } from "#src/utils/env/isDevEnv.ts"

export function signInViaPasswordFormStateCreate(
  factory: () => typeof signInViaPasswordCreateStateManagement | undefined,
) {
  const sm = (factory() ?? signInViaPasswordCreateStateManagement)()
  if (!factory() && isDevEnv()) addKeyboardListenerAlt("t", sm.fillTestData)
  return {
    ...sm,
    emailInput: (value: string) => {
      sm.state.email.set(value)
      sm.validateOnChange("email")(value)
    },
    emailBlur: (value: string) => sm.validateOnChange("email")(value),
    passwordInput: (value: string) => {
      sm.state.password.set(value)
      sm.validateOnChange("password")(value)
    },
    passwordBlur: (value: string) => sm.validateOnChange("password")(value),
  }
}
