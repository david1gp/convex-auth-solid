// import { AuthMiniHero } from "#src/auth/AuthMiniHero.js"
import { ttc } from "#src/app/i18n/ttc.js"
import { NavAuth } from "#src/app/nav/NavAuth.jsx"
import { DevLoginSection } from "#src/auth/ui/sign_in/dev/DevLoginSection.jsx"
import { SignInWithAnExistingSession } from "#src/auth/ui/sign_in/existing/SignInWithAnExistingSession.jsx"
import { AuthLegalAgree } from "#src/auth/ui/sign_in/legal/AuthLegalAgree.jsx"
import { authLegalAgreeVariant } from "#src/auth/ui/sign_in/legal/authLegalAgreeVariant.jsx"
import { SocialLoginButtonsSection } from "#src/auth/ui/sign_in/social/SocialLoginButtonsSection.jsx"
import { classesBgGray } from "#ui/classes/classesBg.jsx"
import { classArr } from "#ui/utils/classArr.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import type { MayHaveInnerClass } from "#ui/utils/MayHaveInnerClass.js"

export interface SignInPageSocialOnlyProps extends MayHaveClass, MayHaveInnerClass {}

export function SignInPageSocialOnly(p: SignInPageSocialOnlyProps) {
  return (
    <div class={classArr("min-h-dvh w-full", classesBgGray, p.class)}>
      <div class={classArr("container max-w-7xl mx-auto", "space-y-8", "dark:text-white", "py-4 px-4", p.innerClass)}>
        <NavAuth title={ttc("Sign in via Social Account")} />
        {/* <AuthMiniHero /> */}
        <SignInWithAnExistingSession class="" />
        <SocialLoginButtonsSection class="" />
        <DevLoginSection class="" />
        <AuthLegalAgree variant={authLegalAgreeVariant.signIn} />
      </div>
    </div>
  )
}
