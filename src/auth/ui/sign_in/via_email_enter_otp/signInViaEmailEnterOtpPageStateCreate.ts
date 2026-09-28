import { posthog } from "posthog-js"
import { languageSignalGet } from "#src/app/i18n/languageSignal.ts"
import { ttc } from "#src/app/i18n/ttc.ts"
import { apiAuthSignInViaEmailEnterOtp } from "#src/auth/api_client/apiAuthSignInViaEmailEnterOtp.ts"
import { signInSessionNew } from "#src/auth/ui/sign_in/logic/signInSessionNew.ts"
import { navigateTo } from "#src/utils/router/navigateTo.ts"
import { toastAdd } from "#ui/interactive/toast/toastAdd.ts"
import { toastVariant } from "#ui/interactive/toast/toastVariant.ts"

export function signInViaEmailEnterOtpPageStateCreate() {
  return {
    async confirm(otp: string, email: string, returnPath: string) {
      const op = "signInViaEmailEnterOtpPageStateCreate.confirm"
      const result = await apiAuthSignInViaEmailEnterOtp({ email, code: otp, l: languageSignalGet() })
      posthog.capture(op, result)
      if (!result.success) {
        console.error(op)
        toastAdd({ title: ttc("Error entering otp"), description: result.errorMessage })
        return
      }
      toastAdd({ title: ttc("Successfully entered OTP"), variant: toastVariant.success })
      signInSessionNew(result.data)
      navigateTo(returnPath)
    },
  }
}
