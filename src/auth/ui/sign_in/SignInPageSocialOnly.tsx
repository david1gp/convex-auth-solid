// import { AuthMiniHero } from "@/auth/AuthMiniHero"
import { NavApp } from "@/auth/ui/nav/NavApp"
import { DevLoginSection } from "@/auth/ui/sign_in/dev/DevLoginSection"
import { SignInWithAnExistingSession } from "@/auth/ui/sign_in/existing/SignInWithAnExistingSession"
import { AuthLegalAgree } from "@/auth/ui/sign_in/legal/AuthLegalAgree"
import { authLegalAgreeVariant } from "@/auth/ui/sign_in/legal/authLegalAgreeVariant"
import { SocialLoginButtonsSection } from "@/auth/ui/sign_in/social/SocialLoginButtonsSection"
import { classesBgGray } from "~ui/classes/classesBg"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveInnerClassName } from "~ui/utils/MayHaveInnerClassName"

export interface SignInPageSocialOnlyProps extends MayHaveClass, MayHaveInnerClassName {}

export function SignInPageSocialOnly(p: SignInPageSocialOnlyProps) {
  return (
    <div class={classArr("min-h-dvh w-full", classesBgGray, p.class)}>
      <div class={classArr("container max-w-7xl mx-auto", "space-y-8", "dark:text-white", "py-4 px-4", p.innerClass)}>
        <NavApp />
        {/* <AuthMiniHero /> */}
        <SignInWithAnExistingSession class="" />
        <SocialLoginButtonsSection class="" />
        <DevLoginSection class="" />
        <AuthLegalAgree variant={authLegalAgreeVariant.signIn} />
      </div>
    </div>
  )
}
