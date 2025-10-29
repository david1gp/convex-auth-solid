import { apiAuthSignUpConfirmEmail } from "@/auth/api/apiAuthSignUpConfirmEmail"
import { NavAuth } from "@/auth/ui/nav/NavAuth"
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
import { createSignalObject } from "~ui/utils/createSignalObject"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { EnterOtpForm } from "../../email/EnterOtpForm"

export const SignUpConfirmEmailPage: Component<{}> = () => {
  return (
    <LayoutWrapperDemo title={ttt("Sign Up / Confirm Email")}>
      <div class={classArr("min-h-dvh w-full", classesBgGray)}>
        <NavAuth />
        <div
          class={classArr("max-w-7xl", "flex flex-col lg:flex-row items-center lg:justify-center gap-12", "p-4 mb-4")}
        >
          <div class="bg-indigo-400 rounded-full p-4 flex items-center justify-center size-70">
            <Icon0 path={mdiEmailSearchOutline} class="size-52 fill-white text-white" />
          </div>
          {/* <Icon0 path={iconEmailOutlineThin} class="size-30 fill-blue-400 text-blue-400" /> */}
          <SignUpConfirmEmail class={classArr("max-w-xl", "p-4 mb-4")} />
        </div>
      </div>
    </LayoutWrapperDemo>
  )
}

const SignUpConfirmEmail: Component<MayHaveClass> = (p) => {
  const searchParams = useSearchParamsObject()
  const navigate = useNavigate()
  const isSubmitting = createSignalObject(false)

  function getEmail() {
    return getSearchParamAsString(searchParams, "email")
  }
  function getReturnUrl() {
    return getSearchParamAsString(searchParams, "returnUrl") ?? urlSignInRedirectUrl()
  }

  const handleConfirm = async (otp: string, email: string) => {
    isSubmitting.set(true)

    const result = await apiAuthSignUpConfirmEmail({ email, code: otp })
    if (!result.success) {
      toastAdd({ title: "Error confirming email", description: result.errorMessage })
      return
    }
    isSubmitting.set(false)

    const userSession = result.data
    // save user session
    userSessionsSignalAdd(userSession)
    userSessionSignal.set(userSession)

    const returnUrl = getReturnUrl()
    console.log("Registration email confirmation", { otp, email, returnUrl })
    navigate(returnUrl)
  }

  return (
    <EnterOtpForm
      title="Verify Your Email"
      subtitle="Almost there! Confirm your email to activate your account."
      sentMessage="We’ve sent a 6-digit code to"
      instruction="Enter it below to verify your email and complete your registration."
      buttonText="Verify Email"
      email={getEmail()}
      actionFn={handleConfirm}
      class={p.class}
    />
  )
}
