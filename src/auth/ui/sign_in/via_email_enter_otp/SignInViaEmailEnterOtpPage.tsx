import { NavApp } from "@/auth/ui/nav/NavApp"
import { mdiEmailSearchOutline } from "@mdi/js"
import { useNavigate, useSearchParams } from "@solidjs/router"
import type { Component } from "solid-js"
import { classesBgGray } from "~ui/classes/classesBg"
import { ttt } from "~ui/i18n/ttt"
import { LayoutWrapperDemo } from "~ui/static/container/LayoutWrapperDemo"
import { Icon0 } from "~ui/static/icon/Icon0"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { EnterOtpForm } from "../../email/EnterOtpForm"
import { signInViaEmailEnterOtpCreateStateManagement } from "./signInViaEmailEnterOtpCreateStateManagement"

export const SignInViaEmailEnterOtpPage: Component<{}> = () => {
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
  const sm = signInViaEmailEnterOtpCreateStateManagement(navigate)
  const email = sm.getEmail(search)
  const returnPath = sm.getReturnPath(search)
  const handleConfirm = async (otp: string, emailParam: string) => {
    await sm.handleConfirm(otp, emailParam, returnPath)
  }

  return (
    <EnterOtpForm
      title="Sign In to Your Account"
      subtitle="Almost there! Enter the code we just emailed you to sign In."
      sentMessage="A one-time code was sent to"
      instruction="Enter it below to securely sign in."
      buttonText="Sign In"
      email={email}
      actionFn={handleConfirm}
      class={p.class}
    />
  )
}
