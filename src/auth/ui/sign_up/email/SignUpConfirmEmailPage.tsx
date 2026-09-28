import { mdiEmailSearchOutline } from "@adaptive-ds/mdi/mdiEmailSearchOutline.js"
import type { Component } from "solid-js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NavAuth } from "#src/app/nav/NavAuth.tsx"
import { EnterOtpForm } from "#src/auth/ui/email/EnterOtpForm.tsx"
import { signUpConfirmEmailViewStateCreate } from "#src/auth/ui/sign_up/email/signUpConfirmEmailViewStateCreate.ts"
import { classesBgGray } from "#ui/classes/classesBg.jsx"
import { Icon } from "#ui/static/icon/Icon.jsx"
import { LayoutWrapperDemo } from "#ui/static/layout/LayoutWrapperDemo.jsx"
import { classArr } from "#ui/utils/classArr.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

export const SignUpConfirmEmailPage: Component<{}> = () => {
  return (
    <LayoutWrapperDemo title={ttc("Sign Up / Confirm Email")}>
      <div class={classArr("min-h-dvh w-full", classesBgGray)}>
        <NavAuth title={ttc("Sign Up / Confirm Email")} />
        <SignUpConfirmEmailView />
      </div>
    </LayoutWrapperDemo>
  )
}

export const SignUpConfirmEmailView: Component<
  MayHaveClass & { actionFn?: (otp: string, email: string, returnPath: string) => Promise<void>; initialEmail?: string }
> = (p) => {
  const state = signUpConfirmEmailViewStateCreate(() => p)
  return (
    <div
      class={classArr(
        "max-w-7xl",
        "flex flex-col lg:flex-row items-center lg:justify-center gap-12",
        "p-4 mb-4",
        p.class,
      )}
    >
      <div class="bg-indigo-400 rounded-full p-4 flex items-center justify-center size-70">
        <Icon path={mdiEmailSearchOutline} class="size-52 fill-white text-white" />
      </div>
      <EnterOtpForm
        title={ttc("Verify Your Email")}
        subtitle={ttc("Almost there! Confirm your email to activate your account.")}
        sentMessage={ttc("We’ve sent a 6-digit code to")}
        instruction={ttc("Enter it below to verify your email and complete your registration.")}
        buttonText={ttc("Verify Email")}
        actionFn={state.actionFn}
        initialEmail={p.initialEmail}
        class="max-w-xl p-4 mb-4"
      />
    </div>
  )
}
