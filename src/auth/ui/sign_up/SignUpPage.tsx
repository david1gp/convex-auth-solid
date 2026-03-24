import { enableGithub } from "#src/app/config/enableGithub.js"
import { ttc } from "#src/app/i18n/ttc.js"
import { NavAuth } from "#src/app/nav/NavAuth.js"
import { socialLoginProvider } from "#src/auth/model_field/socialLoginProvider.js"
import { AuthSectionCard } from "#src/auth/ui/shared/AuthSectionCard.js"
import { SignInWithAnExistingSession } from "#src/auth/ui/sign_in/existing/SignInWithAnExistingSession.js"
import { socialProviderButtonProps } from "#src/auth/ui/sign_in/social/SocialProviderButtonProps.js"
import { SignUpEmailPasswordForm } from "#src/auth/ui/sign_up/form/SignUpEmailPasswordForm.js"
import { SignInButtonLink } from "#src/auth/ui/sign_up/SignInButtonLink.js"
import { userSessionsSignal } from "#src/auth/ui/signals/userSessionsSignal.js"
import { urlAuthProvider } from "#src/auth/url/urlAuthProvider.js"
import { urlSignInRedirectUrl } from "#src/auth/url/urlSignInRedirectUrl.js"
import { searchParamGet } from "#src/utils/router/searchParamGet.js"
import { classesBgGray } from "#ui/classes/classesBg"
import { buttonSize, buttonVariant } from "#ui/interactive/button/buttonCva"
import { LinkButton } from "#ui/interactive/link/LinkButton"
import { LayoutWrapperDemo } from "#ui/static/container/LayoutWrapperDemo"
import { linkIcons } from "#ui/static/icon/linkIcons"
import { Img } from "#ui/static/img/Img"
import { PageWrapper } from "#ui/static/page/PageWrapper"
import { Separator } from "#ui/static/separator/Separator"
import { classArr } from "#ui/utils/classArr"
import { classMerge } from "#ui/utils/classMerge"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"
import type { MayHaveInnerClass } from "#ui/utils/MayHaveInnerClass"
import { capitalizeFirstLetter } from "#utils/text/capitalizeFirstLetter"
import { mdiAccountPlus } from "@mdi/js"
import { type Component } from "solid-js"

interface SignUpPageProps extends MayHaveClass, MayHaveInnerClass {}

export const SignUpPage: Component<SignUpPageProps> = (p) => {
  return (
    <LayoutWrapperDemo title={ttc("Sign up")}>
      <div class={classMerge("min-h-dvh w-full", classesBgGray, p.class)}>
        <NavAuth title={ttc("Sign up")}>
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
      title={ttc("Create new account")}
      subtitle={ttc("Join us and start your journey")}
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
      <h2 class="text-xl font-semibold">{ttc("Sign Up With")}</h2>
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
      variant={buttonVariant.filledIndigo}
      class={p.class}
    >
      {text}
    </LinkButton>
  )
}

function HaveAnAccountSection() {
  return (
    <section class="space-y-2">
      <h2 class="text-xl font-semibold">{ttc("Have an account?")}</h2>
      <SignInButtonLink text={ttc("Sign In instead")} class="w-full" />
    </section>
  )
}
