import { NavAuth } from "@/app/nav/NavAuth"
import { apiAuthSignInViaEmailEnterOtp } from "@/auth/api/apiAuthSignInViaEmailEnterOtp"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { userSessionsSignalAdd } from "@/auth/ui/signals/userSessionsSignal"
import { navigateTo } from "@/utils/router/navigateTo"
import { mdiEmailSearchOutline } from "@mdi/js"
import { type Component } from "solid-js"
import { classesBgGray } from "~ui/classes/classesBg"
import { ttt } from "~ui/i18n/ttt"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { LayoutWrapperDemo } from "~ui/static/container/LayoutWrapperDemo"
import { Icon0 } from "~ui/static/icon/Icon0"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { EnterOtpForm } from "../../email/EnterOtpForm"

export const SignInViaEmailEnterOtpPage: Component<{}> = () => {
  const title = "Enter Code to Sign In"
  return (
    <LayoutWrapperDemo title={ttt(title)}>
      <div class={classArr("min-h-dvh w-full", classesBgGray)}>
        <NavAuth title={title} />
        <div
          class={classArr("max-w-7xl", "flex flex-col lg:flex-row items-center lg:justify-center gap-12", "p-4 mb-4")}
        >
          <div class="bg-indigo-400 rounded-full p-4 flex items-center justify-center size-70">
            <Icon0 path={mdiEmailSearchOutline} class="size-55 fill-white text-white" />
          </div>
          {/* <Icon0 path={iconEmailOutlineThin} class="size-30 fill-blue-400 text-blue-400" /> */}
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
      title={ttt("Sign In to Your Account")}
      subtitle={ttt("Almost there! Enter the code we just emailed you to sign In.")}
      sentMessage={ttt("A one-time code was sent to")}
      instruction={ttt("Enter it below to securely sign in.")}
      buttonText={ttt("Sign In")}
      actionFn={handleSubmit}
      class={p.class}
    />
  )
}

async function handleConfirm(otp: string, email: string, returnPath: string) {
  const result = await apiAuthSignInViaEmailEnterOtp({ email, code: otp })
  if (!result.success) {
    toastAdd({ title: "Error entering otp", description: result.errorMessage })
    return
  }
  const userSession = result.data
  // save user session
  userSessionsSignalAdd(userSession)
  userSessionSignal.set(userSession)
  // navigate
  navigateTo(returnPath)
}
