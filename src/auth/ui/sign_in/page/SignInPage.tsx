import { NavAuth } from "@/app/nav/NavAuth"
import { appName } from "@/app/text/appName"
import { SignInPageContent } from "@/auth/ui/sign_in/page/SignInPageContent"
import { SignUpButtonLink } from "@/auth/ui/sign_in/page/SignUpButtonLink"
import { mdiAccountPlus } from "@mdi/js"
import { classesBgGray } from "~ui/classes/classesBg"
import { ttt } from "~ui/i18n/ttt"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { LayoutWrapperDemo } from "~ui/static/container/LayoutWrapperDemo"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveInnerClass } from "~ui/utils/MayHaveInnerClass"

interface SignInPageContent2Props extends MayHaveClass, MayHaveInnerClass {}

export function SignInPage(p: SignInPageContent2Props) {
  const pageTitle = ttt("Sign In - " + appName)
  const title = ttt("Sign In")
  return (
    <LayoutWrapperDemo title={pageTitle}>
      <div class={classArr("min-h-dvh w-full", classesBgGray, p.class)}>
        <NavAuth title={title}>
          <SignUpButtonLink size={buttonSize.default} variant={buttonVariant.link} icon={mdiAccountPlus} iconRight="" />
        </NavAuth>
        <SignInPageContent class={p.innerClass} />
      </div>
    </LayoutWrapperDemo>
  )
}
