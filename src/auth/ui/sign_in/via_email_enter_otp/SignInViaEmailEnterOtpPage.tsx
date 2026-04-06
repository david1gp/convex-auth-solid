import { languageSignalGet } from "#src/app/i18n/languageSignal.ts"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NavAuth } from "#src/app/nav/NavAuth.tsx"
import { apiAuthSignInViaEmailEnterOtp } from "#src/auth/api_client/apiAuthSignInViaEmailEnterOtp.ts"
import { EnterOtpForm } from "#src/auth/ui/email/EnterOtpForm.tsx"
import { signInSessionNew } from "#src/auth/ui/sign_in/logic/signInSessionNew.ts"
import { navigateTo } from "#src/utils/router/navigateTo.ts"
import { classesBgGray } from "#ui/classes/classesBg.jsx"
import { toastAdd } from "#ui/interactive/toast/toastAdd.ts"
import { toastVariant } from "#ui/interactive/toast/toastVariant.ts"
import { Icon } from "#ui/static/icon/Icon.jsx"
import { LayoutWrapperDemo } from "#ui/static/layout/LayoutWrapperDemo.jsx"
import { classArr } from "#ui/utils/classArr.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { mdiEmailSearchOutline } from "@mdi/js"
import { posthog } from "posthog-js"
import { type Component } from "solid-js"

export const SignInViaEmailEnterOtpPage: Component<{}> = () => {
  const getTitle = () => ttc("Enter Code to Sign In")
  return (
    <LayoutWrapperDemo title={getTitle()}>
      <div class={classArr("min-h-dvh w-full", classesBgGray)}>
        <NavAuth title={getTitle()} />
        <div
          class={classArr("max-w-7xl", "flex flex-col lg:flex-row items-center lg:justify-center gap-12", "p-4 mb-4")}
        >
          <div class="bg-indigo-400 rounded-full p-4 flex items-center justify-center size-70">
            <Icon path={mdiEmailSearchOutline} class="size-55 fill-white text-white" />
          </div>
          {/* <Icon path={iconEmailOutlineThin} class="size-30 fill-blue-400 text-blue-400" /> */}
          <SignInViaEmailEnterOtp class={classArr("max-w-xl", "p-4 mb-4")} />
        </div>
      </div>
    </LayoutWrapperDemo>
  )
}

export const SignInViaEmailEnterOtp: Component<MayHaveClass> = (p) => {
  async function handleSubmit(otp: string, emailParam: string, returnPath: string) {
    return handleConfirm(otp, emailParam, returnPath)
  }
  return (
    <EnterOtpForm
      title={ttc("Sign In to Your Account")}
      subtitle={ttc("Almost there! Enter the code we just emailed you to sign In.")}
      sentMessage={ttc("A one-time code was sent to")}
      instruction={ttc("Enter it below to securely sign in.")}
      buttonText={ttc("Sign In")}
      actionFn={handleSubmit}
      class={p.class}
    />
  )
}

async function handleConfirm(otp: string, email: string, returnPath: string) {
  const op = "handleConfirm.apiAuthSignInViaEmailEnterOtp"
  const result = await apiAuthSignInViaEmailEnterOtp({ email, code: otp, l: languageSignalGet() })
  posthog.capture(op, result)
  if (!result.success) {
    const errorMessage = ttc("Error entering otp")
    console.error(op)
    toastAdd({ title: errorMessage, description: result.errorMessage })
    return
  }
  toastAdd({ title: ttc("Successfully entered OTP"), variant: toastVariant.success })
  const userSession = result.data
  signInSessionNew(userSession)
  navigateTo(returnPath)
}
