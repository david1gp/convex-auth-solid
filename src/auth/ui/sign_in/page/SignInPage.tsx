import { appName } from "@/app/text/appName"
import { NavApp } from "@/auth/ui/nav/NavApp"
import { SignInPageContent } from "@/auth/ui/sign_in/page/SignInPageContent"
import { classesBgGray } from "~ui/classes/classesBg"
import { ttt } from "~ui/i18n/ttt"
import { LayoutWrapperDemo } from "~ui/static/container/LayoutWrapperDemo"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveInnerClassName } from "~ui/utils/MayHaveInnerClassName"

interface SignInPageContent2Props extends MayHaveClass, MayHaveInnerClassName {}

export function SignInPage(p: SignInPageContent2Props) {
  return (
    <LayoutWrapperDemo title={ttt("Sign In - " + appName)}>
      <div class={classArr("min-h-dvh w-full", classesBgGray, p.class)}>
        <NavApp />
        <SignInPageContent class={p.innerClass} />
      </div>
    </LayoutWrapperDemo>
  )
}
