import { NavAuth } from "@/app/nav/NavAuth"
import { apiAuthSignInViaEmailEnterOtp } from "@/auth/api/apiAuthSignInViaEmailEnterOtp"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { userSessionsSignalAdd } from "@/auth/ui/signals/userSessionsSignal"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { getSearchParamAsString } from "@/utils/ui/router/getSearchParam"
import { useSearchParamsObject } from "@/utils/ui/router/useSearchParamsObject"
import { mdiEmailSearchOutline } from "@mdi/js"
import { useNavigate } from "@solidjs/router"
import type { Component } from "solid-js"
import { classesBgGray } from "~ui/classes/classesBg"
import { ttt } from "~ui/i18n/ttt"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { LayoutWrapperDemo } from "~ui/static/container/LayoutWrapperDemo"
import { Icon0 } from "~ui/static/icon/Icon0"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { NavigateTo } from "~ui/utils/NavigateTo"
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
  const navigate = useNavigate()
  const searchParams = useSearchParamsObject()
  const email = getSearchParamAsString(searchParams, "email")
  async function handleSubmit(otp: string, emailParam: string) {
    const returnPath = getSearchParamAsString(searchParams, "returnPath") ?? urlSignInRedirectUrl()
    return handleConfirm(otp, emailParam, returnPath, navigate)
  }
  return (
    <EnterOtpForm
      title="Sign In to Your Account"
      subtitle="Almost there! Enter the code we just emailed you to sign In."
      sentMessage="A one-time code was sent to"
      instruction="Enter it below to securely sign in."
      buttonText="Sign In"
      email={email}
      actionFn={handleSubmit}
      class={p.class}
    />
  )
}

async function handleConfirm(otp: string, email: string, returnPath: string, navigate: NavigateTo) {
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
  navigate(returnPath)
}
