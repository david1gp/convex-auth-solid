import { posthog } from "posthog-js"
import { languageSignalGet } from "#src/app/i18n/languageSignal.ts"
import { ttc } from "#src/app/i18n/ttc.ts"
import { apiAuthSignUpConfirmEmail } from "#src/auth/api_client/apiAuthSignUpConfirmEmail.ts"
import { signInSessionNew } from "#src/auth/ui/sign_in/logic/signInSessionNew.ts"
import { navigateTo } from "#src/utils/router/navigateTo.ts"
import { toastAdd } from "#ui/interactive/toast/toastAdd.ts"
import { toastVariant } from "#ui/interactive/toast/toastVariant.ts"

export function signUpConfirmEmailViewStateCreate(
  props: () => { actionFn?: (otp: string, email: string, returnPath: string) => Promise<void> },
) {
  return {
    actionFn: (otp: string, email: string, returnPath: string) =>
      (props().actionFn ?? signUpConfirmEmailSubmit)(otp, email, returnPath),
  }
}

async function signUpConfirmEmailSubmit(otp: string, email: string, returnPath: string) {
  const op = "handleConfirm.apiAuthSignUpConfirmEmail"
  const result = await apiAuthSignUpConfirmEmail({ email, code: otp, l: languageSignalGet() })
  posthog.capture(op, result)
  if (!result.success) {
    const errorMessage = ttc("Error confirming email")
    console.error(op, errorMessage, result)
    toastAdd({ title: errorMessage, description: result.errorMessage })
    return
  }
  toastAdd({ title: ttc("Email Confirmed"), variant: toastVariant.success })
  signInSessionNew(result.data)
  navigateTo(returnPath)
}
