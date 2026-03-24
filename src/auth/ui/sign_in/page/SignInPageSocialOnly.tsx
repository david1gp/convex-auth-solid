// import { AuthMiniHero } from "#src/auth/AuthMiniHero.js"
import { ttc } from "#src/app/i18n/ttc.js"
import { NavAuth } from "#src/app/nav/NavAuth.js"
import { DevLoginSection } from "#src/auth/ui/sign_in/dev/DevLoginSection.js"
import { SignInWithAnExistingSession } from "#src/auth/ui/sign_in/existing/SignInWithAnExistingSession.js"
import { AuthLegalAgree } from "#src/auth/ui/sign_in/legal/AuthLegalAgree.js"
import { authLegalAgreeVariant } from "#src/auth/ui/sign_in/legal/authLegalAgreeVariant.js"
import { SocialLoginButtonsSection } from "#src/auth/ui/sign_in/social/SocialLoginButtonsSection.js"
import { classesBgGray } from "#ui/classes/classesBg"
import { classArr } from "#ui/utils/classArr"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"
import type { MayHaveInnerClass } from "#ui/utils/MayHaveInnerClass"

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
