import { mdiEmailSearchOutline } from "@adaptive-ds/mdi/mdiEmailSearchOutline.js"
import type { JSX } from "solid-js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { EnterOtpForm } from "#src/auth/ui/email/EnterOtpForm.tsx"
import { classesBgGray } from "#ui/classes/classesBg.jsx"
import { Icon } from "#ui/static/icon/Icon.jsx"
import { classArr } from "#ui/utils/classArr.ts"

export function SignInViaEmailEnterOtpView(p: {
  actionFn: (otp: string, email: string, returnPath: string) => Promise<void>
  initialEmail?: string
  nav?: JSX.Element
}) {
  return (
    <div class={classArr("min-h-dvh w-full", classesBgGray)}>
      {p.nav}
      <div class={classArr("max-w-7xl", "flex flex-col lg:flex-row items-center lg:justify-center gap-12", "p-4 mb-4")}>
        <div class="bg-indigo-400 rounded-full p-4 flex items-center justify-center size-70">
          <Icon path={mdiEmailSearchOutline} class="size-55 fill-white text-white" />
        </div>
        <EnterOtpForm
          title={ttc("Sign In to Your Account")}
          subtitle={ttc("Almost there! Enter the code we just emailed you to sign In.")}
          sentMessage={ttc("A one-time code was sent to")}
          instruction={ttc("Enter it below to securely sign in.")}
          buttonText={ttc("Sign In")}
          actionFn={p.actionFn}
          initialEmail={p.initialEmail}
          class={classArr("max-w-xl", "p-4 mb-4")}
        />
      </div>
    </div>
  )
}
