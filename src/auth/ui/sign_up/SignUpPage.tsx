import { NavAuth } from "@/app/nav/NavAuth"
import { appName } from "@/app/text/appName"
import { socialLoginProvider } from "@/auth/model/socialLoginProvider"
import { SignInWithAnExistingSession } from "@/auth/ui/sign_in/existing/SignInWithAnExistingSession"
import { socialProviderButtonProps } from "@/auth/ui/sign_in/social/SocialProviderButtonProps"
import { SignUpEmailPasswordForm } from "@/auth/ui/sign_up/form/SignUpEmailPasswordForm"
import { SignInButtonLink } from "@/auth/ui/sign_up/SignInButtonLink"
import { urlAuthProvider } from "@/auth/url/urlAuthProvider"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { getSearchParamAsString } from "@/utils/ui/router/getSearchParam"
import { useSearchParamsObject } from "@/utils/ui/router/useSearchParamsObject"
import { type Component } from "solid-js"
import { classesBgGray } from "~ui/classes/classesBg"
import { ttt } from "~ui/i18n/ttt"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { LayoutWrapperDemo } from "~ui/static/container/LayoutWrapperDemo"
import { linkIcons } from "~ui/static/icon/linkIcons"
import { Img } from "~ui/static/img/Img"
import { Separator } from "~ui/static/separator/Separator"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveInnerClass } from "~ui/utils/MayHaveInnerClass"
import { capitalizeFirstLetter } from "~utils/text/capitalizeFirstLetter"

interface SignUpPageProps extends MayHaveClass, MayHaveInnerClass {}

export const SignUpPage: Component<SignUpPageProps> = (p) => {
  const pageTitle = ttt("Sign up") + " - " + appName
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
    <section class="space-y-4 max-w-2xl">
      <h2 class="text-xl font-semibold">{ttt("Create new account")}</h2>
      <SignUpEmailPasswordForm />
    </section>
  )
}

function SignUpSocialSection() {
  const buttonClasses = ""
  const btnSize = buttonSize.lg
  return (
    <section class="flex flex-col gap-4 max-w-2xl">
      <h2 class="text-xl font-semibold">Sign up via social account</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SocialSignUpButton provider={socialLoginProvider.google} size={btnSize} class={buttonClasses} />
        <SocialSignUpButton provider={socialLoginProvider.github} size={btnSize} class={buttonClasses} />
      </div>
    </section>
  )
}

interface SocialSignUpButtonProps {
  provider: (typeof socialLoginProvider)[keyof typeof socialLoginProvider]
  size?: (typeof buttonSize)[keyof typeof buttonSize]
  class?: string
}

function SocialSignUpButton(p: SocialSignUpButtonProps) {
  const searchParams = useSearchParamsObject()
  const props = socialProviderButtonProps[p.provider]

  const text = "Sign up with " + capitalizeFirstLetter(p.provider)

  function getReturnPath() {
    const returnPath = getSearchParamAsString(searchParams, "returnPath") ?? urlSignInRedirectUrl()
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
