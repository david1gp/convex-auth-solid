import { appName } from "@/app/text/appName"
import { socialLoginProvider } from "@/auth/model/socialLoginProvider"
import { NavAuth } from "@/auth/ui/nav/NavAuth"
import { SignInWithAnExistingSession } from "@/auth/ui/sign_in/existing/SignInWithAnExistingSession"
import { socialProviderButtonProps } from "@/auth/ui/sign_in/social/SocialProviderButtonProps"
import { SignUpEmailPasswordForm } from "@/auth/ui/sign_up/form/SignUpEmailPasswordForm"
import { urlPageSignIn } from "@/auth/url/pageRouteAuth"
import { urlAuthProvider } from "@/auth/url/urlAuthProvider"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { getSearchParamAsString } from "@/utils/ui/router/getSearchParam"
import { useSearchParamsObject } from "@/utils/ui/router/useSearchParamsObject"
import { mdiArrowRight } from "@mdi/js"
import { type Component } from "solid-js"
import { classesBgGray } from "~ui/classes/classesBg"
import { ttt } from "~ui/i18n/ttt"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { LayoutWrapperDemo } from "~ui/static/container/LayoutWrapperDemo"
import { Img } from "~ui/static/img/Img"
import { Separator } from "~ui/static/separator/Separator"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveInnerClass } from "~ui/utils/MayHaveInnerClass"
import { capitalizeFirstLetter } from "~utils/text/capitalizeFirstLetter"

interface SignUpPageProps extends MayHaveClass, MayHaveInnerClass {}

export const SignUpPage: Component<SignUpPageProps> = (p) => {
  return (
    <LayoutWrapperDemo title={"Sign up - " + appName}>
      <div class={classMerge("min-h-dvh w-full", classesBgGray, p.class)}>
        <NavAuth />
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

  function getUrl() {
    const returnUrl = getSearchParamAsString(searchParams, "returnUrl") ?? urlSignInRedirectUrl()
    return urlAuthProvider(p.provider, returnUrl)
  }

  return (
    <LinkButton
      href={getUrl()}
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
  const searchParams = useSearchParamsObject()
  function getUrl() {
    const email = getSearchParamAsString(searchParams, "email")
    const returnUrl = getSearchParamAsString(searchParams, "returnUrl") ?? urlSignInRedirectUrl()
    return urlPageSignIn(email, returnUrl)
  }
  return (
    <section class="space-y-2">
      <h2 class="text-xl font-semibold">{ttt("Have an account?")}</h2>
      <LinkButton href={getUrl()} iconRight={mdiArrowRight} size={buttonSize.lg} variant={buttonVariant.default}>
        {ttt("Sign In instead")}
      </LinkButton>
    </section>
  )
}
