import { AuthMiniHero } from "@/auth/AuthMiniHero"
import { mdiArrowRight } from "@mdi/js"
import { DevLoginSection } from "~auth/ui/sign_in/dev/DevLoginSection"
import { SignInWithAnExistingSession } from "~auth/ui/sign_in/existing/SignInWithAnExistingSession"
import { AuthLegalAgree } from "~auth/ui/sign_in/legal/AuthLegalAgree"
import { authLegalAgreeVariant } from "~auth/ui/sign_in/legal/authLegalAgreeVariant"
import { SignInViaEmailForm } from "~auth/ui/sign_in/SignInViaEmailForm"
import { SignInViaPasswordForm } from "~auth/ui/sign_in/SignInViaPasswordForm"
import { SocialLoginButton } from "~auth/ui/sign_in/social/SocialLoginButton"
import { pageRouteAuth } from "~auth/url/pageRouteAuth"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { classesCardWrapperP4 } from "~ui/static/container/classesCardWrapper"
import { classesGridCols3xl } from "~ui/static/container/classesGridCols"
import { classArr } from "~ui/utils/ui/classArr"
import type { MayHaveClass } from "~ui/utils/ui/MayHaveClass"

export function SignInPageContent(p: MayHaveClass) {
  return (
    <div
      class={classArr(
        "container max-w-7xl mx-auto",
        "space-y-8",
        // "dark:text-white",
        "p-4 pb-8",
        classesGridCols3xl,
        "gap-8 max-w-7xl w-full",
        p.class,
      )}
    >
      <AuthMiniHero class="col-span-full text-center" />
      <SignInWithAnExistingSession class="" />

      {/* Sign in via Email/Password */}
      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-center">Sign in via Email/Password</h2>
        <SignInViaPasswordForm class={classesCardWrapperP4} />
      </section>

      {/* Sign in via Email */}
      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-center">Sign in via Email</h2>
        <SignInViaEmailForm class={classesCardWrapperP4} />
      </section>

      {/* Sign in via Social Account */}
      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-center">Sign in via Social Account</h2>

        <div class="flex flex-col justify-center gap-2">
          <SocialLoginButton provider="google" size={buttonSize.default} />
          <SocialLoginButton provider="github" size={buttonSize.default} />
        </div>
      </section>

      <DevLoginSection class="" />
      <NoAccountSection />
      <AuthLegalAgree variant={authLegalAgreeVariant.signIn} class="col-span-full text-center" />
    </div>
  )
}

function NoAccountSection() {
  return (
    <section class="flex flex-col items-center gap-4">
      <h2 class="text-xl font-semibold text-center">Don't have an account?</h2>
      <LinkButton
        href={pageRouteAuth.signUp}
        iconRight={mdiArrowRight}
        size={buttonSize.default}
        variant={buttonVariant.default}
        class="w-full"
      >
        Sign Up instead
      </LinkButton>
    </section>
  )
}
