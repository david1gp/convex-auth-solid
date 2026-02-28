import { languageSignalGet } from "@/app/i18n/languageSignal"
import { ttc } from "@/app/i18n/ttc"
import { NavAuth } from "@/app/nav/NavAuth"
import { apiAuthSignInViaEmailEnterOtp } from "@/auth/api/apiAuthSignInViaEmailEnterOtp"
import { signInSessionNew } from "@/auth/ui/sign_in/logic/signInSessionNew"
import { navigateTo } from "@/utils/router/navigateTo"
import { mdiEmailSearchOutline } from "@mdi/js"
import posthog from "posthog-js"
import { type Component } from "solid-js"
import { classesBgGray } from "~ui/classes/classesBg"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { LayoutWrapperDemo } from "~ui/static/container/LayoutWrapperDemo"
import { Icon } from "~ui/static/icon/Icon"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { EnterOtpForm } from "@/auth/ui/email/EnterOtpForm"

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
