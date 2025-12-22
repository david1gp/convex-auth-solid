import { NavAuth } from "@/app/nav/NavAuth"
import { apiAuthSignUpConfirmEmail } from "@/auth/api/apiAuthSignUpConfirmEmail"
import { signInSessionNew } from "@/auth/ui/sign_in/logic/signInSessionNew"
import { navigateTo } from "@/utils/router/navigateTo"
import { mdiEmailSearchOutline } from "@mdi/js"
import posthog from "posthog-js"
import { type Component } from "solid-js"
import { classesBgGray } from "~ui/classes/classesBg"
import { ttt } from "~ui/i18n/ttt"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { LayoutWrapperDemo } from "~ui/static/container/LayoutWrapperDemo"
import { Icon } from "~ui/static/icon/Icon"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { EnterOtpForm } from "../../email/EnterOtpForm"

export const SignUpConfirmEmailPage: Component<{}> = () => {
  const title = ttt("Sign Up / Confirm Email")
  return (
    <LayoutWrapperDemo title={title}>
      <div class={classArr("min-h-dvh w-full", classesBgGray)}>
        <NavAuth title={title} />
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
      title={ttt("Verify Your Email")}
      subtitle={ttt("Almost there! Confirm your email to activate your account.")}
      sentMessage={ttt("We’ve sent a 6-digit code to")}
      instruction={ttt("Enter it below to verify your email and complete your registration.")}
      buttonText={ttt("Verify Email")}
      actionFn={handleSubmit}
      class={p.class}
    />
  )
}

async function handleConfirm(otp: string, email: string, returnPath: string) {
  const op = "handleConfirm.apiAuthSignUpConfirmEmail"
  const result = await apiAuthSignUpConfirmEmail({ email, code: otp })
  posthog.capture(op, result)
  if (!result.success) {
    const errorMessage = ttt("Error confirming email")
    console.error(op, errorMessage, result)
    toastAdd({ title: errorMessage, description: result.errorMessage })
    return
  }
  toastAdd({ title: ttt("Email Confirmed"), variant: toastVariant.success })
  const userSession = result.data
  // save user session
  signInSessionNew(userSession)
  // navigate
  navigateTo(returnPath)
}
