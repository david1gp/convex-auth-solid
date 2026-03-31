// import { AuthMiniHero } from "#src/auth/AuthMiniHero.ts"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NavAuth } from "#src/app/nav/NavAuth.tsx"
import { DevLoginSection } from "#src/auth/ui/sign_in/dev/DevLoginSection.tsx"
import { SignInWithAnExistingSession } from "#src/auth/ui/sign_in/existing/SignInWithAnExistingSession.tsx"
import { AuthLegalAgree } from "#src/auth/ui/sign_in/legal/AuthLegalAgree.tsx"
import { authLegalAgreeVariant } from "#src/auth/ui/sign_in/legal/authLegalAgreeVariant.tsx"
import { SocialLoginButtonsSection } from "#src/auth/ui/sign_in/social/SocialLoginButtonsSection.tsx"
import { classesBgGray } from "#ui/classes/classesBg.jsx"
import { classArr } from "#ui/utils/classArr.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import type { MayHaveInnerClass } from "#ui/utils/MayHaveInnerClass.ts"

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
