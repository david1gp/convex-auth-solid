import { languageSignalGet } from "#src/app/i18n/languageSignal.js"
import { ttc } from "#src/app/i18n/ttc.js"
import { NavAuth } from "#src/app/nav/NavAuth.jsx"
import { apiAuthSignUpConfirmEmail } from "#src/auth/api/apiAuthSignUpConfirmEmail.js"
import { EnterOtpForm } from "#src/auth/ui/email/EnterOtpForm.jsx"
import { signInSessionNew } from "#src/auth/ui/sign_in/logic/signInSessionNew.js"
import { navigateTo } from "#src/utils/router/navigateTo.js"
import { classesBgGray } from "#ui/classes/classesBg.jsx"
import { toastAdd } from "#ui/interactive/toast/toastAdd.js"
import { toastVariant } from "#ui/interactive/toast/toastVariant.js"
import { LayoutWrapperDemo } from "#ui/static/layout/LayoutWrapperDemo.jsx"
import { Icon } from "#ui/static/icon/Icon.jsx"
import { classArr } from "#ui/utils/classArr.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import { mdiEmailSearchOutline } from "@mdi/js"
import { posthog } from "posthog-js"
import { type Component } from "solid-js"

export const SignUpConfirmEmailPage: Component<{}> = () => {
  return (
    <LayoutWrapperDemo title={ttc("Sign Up / Confirm Email")}>
      <div class={classArr("min-h-dvh w-full", classesBgGray)}>
        <NavAuth title={ttc("Sign Up / Confirm Email")} />
        <div
          class={classArr("max-w-7xl", "flex flex-col lg:flex-row items-center lg:justify-center gap-12", "p-4 mb-4")}
        >
          <div class="bg-indigo-400 rounded-full p-4 flex items-center justify-center size-70">
            <Icon path={mdiEmailSearchOutline} class="size-52 fill-white text-white" />
          </div>
          {/* <Icon path={iconEmailOutlineThin} class="size-30 fill-blue-400 text-blue-400" /> */}
          <SignUpConfirmEmail class={classArr("max-w-xl", "p-4 mb-4")} />
        </div>
      </div>
    </LayoutWrapperDemo>
  )
}

const SignUpConfirmEmail: Component<MayHaveClass> = (p) => {
  async function handleSubmit(otp: string, emailParam: string, returnPath: string) {
    return handleConfirm(otp, emailParam, returnPath)
  }
  return (
    <EnterOtpForm
      title={ttc("Verify Your Email")}
      subtitle={ttc("Almost there! Confirm your email to activate your account.")}
      sentMessage={ttc("We’ve sent a 6-digit code to")}
      instruction={ttc("Enter it below to verify your email and complete your registration.")}
      buttonText={ttc("Verify Email")}
      actionFn={handleSubmit}
      class={p.class}
    />
  )
}

async function handleConfirm(otp: string, email: string, returnPath: string) {
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
  const userSession = result.data
  // save user session
  signInSessionNew(userSession)
  // navigate
  navigateTo(returnPath)
}
