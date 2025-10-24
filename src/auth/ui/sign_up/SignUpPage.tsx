import { appName } from "@/app/text/appName"
import { socialLoginProvider } from "@/auth/model/socialLoginProvider"
import { NavApp } from "@/auth/ui/nav/NavApp"
import { SignInWithAnExistingSession } from "@/auth/ui/sign_in/existing/SignInWithAnExistingSession"
import { socialProviderButtonProps } from "@/auth/ui/sign_in/social/SocialProviderButtonProps"
import { AuthCoverIllustration } from "@/auth/ui/sign_up/AuthCoverIllustration"
import { SignUpEmailPasswordForm } from "@/auth/ui/sign_up/SignUpEmailPasswordForm"
import { pageRouteAuth } from "@/auth/url/pageRouteAuth"
import { urlAuthProvider } from "@/auth/url/urlAuthProvider"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { mdiArrowRight } from "@mdi/js"
import { type Component } from "solid-js"
import { classesBgGray } from "~ui/classes/classesBg"
import { ttt } from "~ui/i18n/ttt"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { LayoutWrapperDemo } from "~ui/static/container/LayoutWrapperDemo"
import { Separator } from "~ui/static/separator/Separator"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveInnerClassName } from "~ui/utils/MayHaveInnerClassName"
import { capitalizeFirstLetter } from "~utils/text/capitalizeFirstLetter"

interface SignUpPageProps extends MayHaveClass, MayHaveInnerClassName {}

export const SignUpPage: Component<SignUpPageProps> = (p) => {
  return (
    <LayoutWrapperDemo title={"Sign up - " + appName}>
      <div class={classMerge("min-h-dvh w-full", classesBgGray, p.class)}>
        <NavApp />
        <div class={classMerge("container max-w-7xl mx-auto py-8 px-4", p.innerClass)}>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LeftSide />
            <RightSide />
          </div>
        </div>
      </div>
    </LayoutWrapperDemo>
  )
}

function LeftSide() {
  return <SignInWithAnExistingSession class="" fallback={<AuthCoverIllustration />} />
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
    <section class="space-y-4 max-w-2xl">
      <h2 class="text-xl font-semibold">{ttt("Create new account")}</h2>
      <SignUpEmailPasswordForm />
    </section>
  )
}

function SignUpSocialSection() {
  const buttonClasses = ""
  const btnSize = buttonSize.lg

  function handleSocialSignUp(provider: (typeof socialLoginProvider)[keyof typeof socialLoginProvider]) {
    // Empty function - will be implemented later
    console.log("Sign up with social:", provider)
  }

  return (
    <section class="flex flex-col gap-4 max-w-2xl">
      <h2 class="text-xl font-semibold">Sign up via social account</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SocialSignUpButton
          provider={socialLoginProvider.google}
          size={btnSize}
          class={buttonClasses}
          onClick={() => handleSocialSignUp(socialLoginProvider.google)}
        />
        <SocialSignUpButton
          provider={socialLoginProvider.github}
          size={btnSize}
          class={buttonClasses}
          onClick={() => handleSocialSignUp(socialLoginProvider.github)}
        />
      </div>
    </section>
  )
}

interface SocialSignUpButtonProps {
  provider: (typeof socialLoginProvider)[keyof typeof socialLoginProvider]
  size?: (typeof buttonSize)[keyof typeof buttonSize]
  class?: string
  onClick: () => void
}

function SocialSignUpButton(p: SocialSignUpButtonProps) {
  const props = socialProviderButtonProps[p.provider]
  const { background, mdiIconPath } = props
  const currentUrl = urlSignInRedirectUrl()
  const text = "Sign up with " + capitalizeFirstLetter(p.provider)
  const url = urlAuthProvider(p.provider, currentUrl) // Reuse for now, adapt later for sign up

  return (
    <LinkButton
      href={url}
      icon={mdiIconPath}
      iconClass="fill-white"
      size={p.size}
      style={{ background }}
      variant={buttonVariant.primary}
      class={p.class}
      onClick={p.onClick}
    >
      {text}
    </LinkButton>
  )
}

function HaveAnAccountSection() {
  return (
    <section class="space-y-2">
      <h2 class="text-xl font-semibold">Have an account?</h2>
      <LinkButton
        href={pageRouteAuth.signIn}
        iconRight={mdiArrowRight}
        size={buttonSize.lg}
        variant={buttonVariant.default}
      >
        Sign In instead
      </LinkButton>
    </section>
  )
}
