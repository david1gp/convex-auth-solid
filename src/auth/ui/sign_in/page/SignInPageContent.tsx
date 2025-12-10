import { enableGithub } from "@/app/config/enableGithub"
import { loginProvider } from "@/auth/model/socialLoginProvider"
import { AuthSectionCard } from "@/auth/ui/shared/AuthSectionCard"
import { AuthSectionHeroIcon } from "@/auth/ui/shared/AuthSectionHeroIcon"
import { DevLoginSection } from "@/auth/ui/sign_in/dev/DevLoginSection"
import { SignInWithAnExistingSession } from "@/auth/ui/sign_in/existing/SignInWithAnExistingSession"
import { AuthLegalAgree } from "@/auth/ui/sign_in/legal/AuthLegalAgree"
import { authLegalAgreeVariant } from "@/auth/ui/sign_in/legal/authLegalAgreeVariant"
import { AuthMiniHero } from "@/auth/ui/sign_in/page/AuthMiniHero"
import { SignUpButtonLink } from "@/auth/ui/sign_in/page/SignUpButtonLink"
import { iconGithub } from "@/auth/ui/sign_in/social/iconGithub"
import { iconGoogle } from "@/auth/ui/sign_in/social/iconGoogle"
import { SocialLoginButton } from "@/auth/ui/sign_in/social/SocialLoginButton"
import { SignInViaEmailForm } from "@/auth/ui/sign_in/via_email/SignInViaEmailForm"
import { SignInViaPasswordForm } from "@/auth/ui/sign_in/via_pw/SignInViaPasswordForm"
import { mdiLockOutline } from "@mdi/js"
import { ttt } from "~ui/i18n/ttt"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { classesCardWrapperP4 } from "~ui/static/container/classesCardWrapper"
import { classesGridCols3lg } from "~ui/static/container/classesGridCols"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export function SignInPageContent(p: MayHaveClass) {
  return (
    <div
      class={classArr(
        "max-w-7xl w-full mx-auto",
        // "space-y-8",
        // "dark:text-white",
        "p-4 pb-8",
        classesGridCols3lg,
        "gap-4 lg:gap-8",
        p.class,
      )}
    >
      <AuthMiniHero class="col-span-full text-center text-balance" />
      <NoAccountSection class="col-span-full mx-auto" />
      <SignInWithAnExistingSession
        class="col-span-full mx-auto contents"
        h2Class="text-2xl col-span-full text-center"
      />
      <h2 class="text-2xl font-semibold col-span-full text-center">{ttt("Sign in with")}</h2>

      <AuthSectionCard icon={mdiLockOutline} title={ttt("Password")} subtitle={ttt("Traditional sign in")}>
        <SignInViaPasswordForm class={"w-full"} />
      </AuthSectionCard>

      <AuthSectionCard icon={mdiLockOutline} title={ttt("Magic Link")} subtitle={ttt("Passwordless email")}>
        <SignInViaEmailForm class={"w-full"} />
      </AuthSectionCard>

      <AuthSectionSocials />

      <DevLoginSection class="" />
      <AuthLegalAgree variant={authLegalAgreeVariant.signIn} class="col-span-full text-center" />
    </div>
  )
}

function AuthSectionSocials() {
  const title = ttt("Socials")
  const subtitle = ttt("One-click sign in")

  if (!enableGithub()) {
    return (
      <AuthSectionCard icon={iconGoogle} title={ttt("Google")} subtitle={ttt("One-click sign in")}>
        <SocialLoginButton provider={loginProvider.google} size={buttonSize.default} class="w-full" />
      </AuthSectionCard>
    )
  }

  return (
    <section class={classArr(classesCardWrapperP4, "flex flex-col items-center")}>
      <div class="flex flex-wrap gap-2">
        <AuthSectionHeroIcon icon={iconGoogle} class="" />
        <AuthSectionHeroIcon icon={iconGithub} class="" />
      </div>
      <h2 class="text-xl font-semibold">{title}</h2>
      <p class="text-muted-foreground mb-4">{subtitle}</p>
      <div class="space-y-2">
        <SocialLoginButton provider={loginProvider.google} size={buttonSize.default} class="w-full" />
        <SocialLoginButton provider={loginProvider.github} size={buttonSize.default} class="w-full" />
      </div>
    </section>
  )
}

function NoAccountSection(p: MayHaveClass) {
  return (
    <section class={classArr("flex flex-wrap gap-4 items-center", p.class)}>
      <h2 class="font-medium">{ttt("Don't have an account?")}</h2>
      <SignUpButtonLink text={ttt("Sign Up instead")} variant={buttonVariant.default} class="pl-4" />
    </section>
  )
}
