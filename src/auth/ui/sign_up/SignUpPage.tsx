import { enableGithub } from "@/app/config/enableGithub"
import { NavAuth } from "@/app/nav/NavAuth"
import { appNameClient } from "@/app/text/appName"
import { socialLoginProvider } from "@/auth/model/socialLoginProvider"
import { AuthSectionCard } from "@/auth/ui/shared/AuthSectionCard"
import { SignInWithAnExistingSession } from "@/auth/ui/sign_in/existing/SignInWithAnExistingSession"
import { socialProviderButtonProps } from "@/auth/ui/sign_in/social/SocialProviderButtonProps"
import { SignUpEmailPasswordForm } from "@/auth/ui/sign_up/form/SignUpEmailPasswordForm"
import { SignInButtonLink } from "@/auth/ui/sign_up/SignInButtonLink"
import { userSessionsSignal } from "@/auth/ui/signals/userSessionsSignal"
import { urlAuthProvider } from "@/auth/url/urlAuthProvider"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { searchParamGet } from "@/utils/router/searchParamGet"
import { mdiAccountPlus } from "@mdi/js"
import { type Component } from "solid-js"
import { classesBgGray } from "~ui/classes/classesBg"
import { ttt } from "~ui/i18n/ttt"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { LayoutWrapperDemo } from "~ui/static/container/LayoutWrapperDemo"
import { linkIcons } from "~ui/static/icon/linkIcons"
import { Img } from "~ui/static/img/Img"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { Separator } from "~ui/static/separator/Separator"
import { classArr } from "~ui/utils/classArr"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveInnerClass } from "~ui/utils/MayHaveInnerClass"
import { capitalizeFirstLetter } from "~utils/text/capitalizeFirstLetter"

interface SignUpPageProps extends MayHaveClass, MayHaveInnerClass {}

export const SignUpPage: Component<SignUpPageProps> = (p) => {
  const pageTitle = ttt("Sign up") + " " + appNameClient()
  const title = ttt("Sign up")
  return (
    <LayoutWrapperDemo title={pageTitle}>
      <div class={classMerge("min-h-dvh w-full", classesBgGray, p.class)}>
        <NavAuth title={title}>
          <SignInButtonLink
            size={buttonSize.default}
            variant={buttonVariant.link}
            icon={linkIcons.enter}
            iconRight=""
          />
        </NavAuth>
        <SignUpPageContent />
      </div>
    </LayoutWrapperDemo>
  )
}

function SignUpPageContent() {
  return (
    <PageWrapper
      innerClass={classArr(
        // "max-w-7xl",
        // "max-w-4xl",
        userSessionsSignal.get().length === 0 && "max-w-4xl",
        // "flex flex-col gap-8",
        "grid grid-cols-1",
        userSessionsSignal.get().length > 0 ? "lg:grid-cols-3" : "lg:grid-cols-2",
        "gap-8",
      )}
    >
      <SignInWithAnExistingSession h2Class="mb-2" innerClass="grid gap-4" />
      <SignUpEmailPasswordSection />
      <div class="flex flex-col gap-8">
        <SignUpSocialSection />
        <HaveAnAccountSection />
      </div>
    </PageWrapper>
  )
}

function SignUpPageContent2() {
  return (
    <div class={classMerge("container max-w-7xl mx-auto py-8 px-4")}>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LeftSide />
        <RightSide />
      </div>
    </div>
  )
}

function LeftSide() {
  return <SignInWithAnExistingSession class="flex flex-col gap-2" />
}

export function AuthCoverIllustration(p: MayHaveClass) {
  const url = "/img/illustrations/auth/sign_in_1.svg"
  return <Img src={url} alt="Sign up illustration" class={classMerge("hidden lg:flex w-full max-w-3xl", p.class)} />
}

function RightSide() {
  return (
    <div class="space-y-8">
      <SignUpEmailPasswordSection />
      <Separator />
      <SignUpSocialSection />
      <Separator />
      <HaveAnAccountSection />
    </div>
  )
}

function SignUpEmailPasswordSection() {
  return (
    <AuthSectionCard
      icon={mdiAccountPlus}
      title={ttt("Create new account")}
      subtitle={ttt("Join us and start your journey")}
      class="space-y-4 max-w-2xl"
    >
      <SignUpEmailPasswordForm />
    </AuthSectionCard>
  )
}

function SignUpSocialSection() {
  const buttonClasses = "w-full"
  const btnSize = buttonSize.default
  return (
    <section class="flex flex-col gap-2">
      <h2 class="text-xl font-semibold">{ttt("Sign Up With")}</h2>
      <SocialSignUpButton provider={socialLoginProvider.google} size={btnSize} class={buttonClasses} />
      {enableGithub() && (
        <SocialSignUpButton provider={socialLoginProvider.github} size={btnSize} class={buttonClasses} />
      )}
    </section>
  )
}

interface SocialSignUpButtonProps {
  provider: (typeof socialLoginProvider)[keyof typeof socialLoginProvider]
  size?: (typeof buttonSize)[keyof typeof buttonSize]
  class?: string
}

function SocialSignUpButton(p: SocialSignUpButtonProps) {
  const props = socialProviderButtonProps[p.provider]
  const text = "Sign up with " + capitalizeFirstLetter(p.provider)
  function getReturnPath() {
    const returnPath = searchParamGet("returnPath") || urlSignInRedirectUrl()
    return urlAuthProvider(p.provider, returnPath)
  }
  return (
    <LinkButton
      href={getReturnPath()}
      icon={props.mdiIconPath}
      iconClass="fill-white"
      size={p.size}
      style={{ background: props.background }}
      variant={buttonVariant.primary}
      class={p.class}
    >
      {text}
    </LinkButton>
  )
}

function HaveAnAccountSection() {
  return (
    <section class="space-y-2">
      <h2 class="text-xl font-semibold">{ttt("Have an account?")}</h2>
      <SignInButtonLink text={ttt("Sign In instead")} class="w-full" />
    </section>
  )
}
