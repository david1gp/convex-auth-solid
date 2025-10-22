import { appName } from "@/app/text/appName"
import { NavBarAuth } from "@/auth/ui/nav/NavBarAuth"
import { SignInPageContent } from "@/auth/ui/sign_in/SignInPageContent"
import type { Component } from "solid-js"
import { classesBgGray } from "~ui/classes/classesBg"
import { ttt } from "~ui/i18n/ttt"
import { LayoutWrapperDemo } from "~ui/static/container/LayoutWrapperDemo"
import { classArr } from "~ui/utils/ui/classArr"
import type { MayHaveClass } from "~ui/utils/ui/MayHaveClass"
import type { MayHaveInnerClassName } from "~ui/utils/ui/MayHaveInnerClassName"

interface SignInPageContent2Props extends MayHaveClass, MayHaveInnerClassName {}

export const SignInPage: Component<SignInPageContent2Props> = (p) => {
  return (
    <LayoutWrapperDemo title={ttt("Sign In - " + appName)}>
      <div class={classArr("min-h-dvh w-full", classesBgGray, p.class)}>
        <NavBarAuth />
        <SignInPageContent class={p.innerClass} />
      </div>
    </LayoutWrapperDemo>
  )
}
