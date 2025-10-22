import { getBaseUrlSignedIn } from "@/app/url/getBaseUrl"
import { apiAuthSignInViaEmailEnterOtp } from "@/auth/api/apiAuthSignInViaEmailEnterOtp"
import { emailSchema } from "@/auth/model/emailSchema"
import { NavApp } from "@/auth/ui/nav/NavApp"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { userSessionsSignalAdd } from "@/auth/ui/signals/userSessionsSignal"
import { mdiEmailSearchOutline } from "@mdi/js"
import { useNavigate, useSearchParams } from "@solidjs/router"
import type { Component } from "solid-js"
import * as v from "valibot"
import { classesBgGray } from "~ui/classes/classesBg"
import { ttt } from "~ui/i18n/ttt"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { LayoutWrapperDemo } from "~ui/static/container/LayoutWrapperDemo"
import { Icon0 } from "~ui/static/icon/Icon0"
import { classArr } from "~ui/utils/ui/classArr"
import type { MayHaveClass } from "~ui/utils/ui/MayHaveClass"
import { createSignInUiState } from "../sign_in/SignInUiState"
import { EnterOtpForm } from "./EnterOtpForm"

export const SignInEnterOtpPage: Component<{}> = () => {
  return (
    <LayoutWrapperDemo title={ttt("Sign In / Enter OTP")}>
      <div class={classArr("min-h-dvh w-full", classesBgGray)}>
        <NavApp />
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
  const [search] = useSearchParams()
  const navigate = useNavigate()
  const state = createSignInUiState()

  function getEmail() {
    const got = search.email
    const parsing = v.safeParse(emailSchema, got)
    if (!parsing.success) {
      console.error("error parsing email search param", got)
      return ""
    }
    return parsing.output
  }

  function getReturnPath() {
    const got = search.returnPath
    const schema = v.pipe(v.string(), v.minLength(1))
    const parsing = v.safeParse(schema, got)
    if (!parsing.success) {
      console.warn("error parsing returnUrl", got)
      return getBaseUrlSignedIn()
    }
    return parsing.output
  }

  // createEffect(() => {
  //   if (!email()) {
  //     navigate("/sign-in", { replace: true })
  //   }
  // })

  const handleConfirm = async (otp: string, email: string) => {
    state.isSubmitting.set(true)

    const result = await apiAuthSignInViaEmailEnterOtp({ email, code: otp })
    if (!result.success) {
      toastAdd({ title: "Error entering otp", description: result.errorMessage })
      return
    }
    state.isSubmitting.set(false)

    const userSession = result.data
    // save user session
    userSessionsSignalAdd(userSession)
    userSessionSignal.set(userSession)
    // navigate
    const returnUrl = getReturnPath()
    navigate(returnUrl)
  }

  return (
    <EnterOtpForm
      title="Sign In to Your Account"
      subtitle="Almost there! Enter the code we just emailed you to sign In."
      sentMessage="A one-time code was sent to"
      instruction="Enter it below to securely sign in."
      buttonText="Sign In"
      email={getEmail()}
      actionFn={handleConfirm}
      class={p.class}
    />
  )
}
