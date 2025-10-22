import { appName } from "@/app/appName"
import { apiClientSignUp } from "@/auth/api/apiClient"
import { socialLoginProvider } from "@/auth/model/socialLoginProvider"
import { NavBarAuth } from "@/auth/ui/nav/NavBarAuth"
import { socialProviderButtonProps } from "@/auth/ui/sign_in/social/SocialProviderButtonProps"
import { AuthCoverIllustration } from "@/auth/ui/sign_up/AuthCoverIllustration"
import { SignUpEmailPasswordForm } from "@/auth/ui/sign_up/SignUpEmailPasswordForm"
import { pageRouteAuth } from "@/auth/url/pageRouteAuth"
import { urlAuthProvider } from "@/auth/url/urlAuthProvider"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { urlSignUpConfirmEmail } from "@/auth/url/urlSignUpConfirmEmail"
import { mdiArrowRight } from "@mdi/js"
import { useLocation, useNavigate } from "@solidjs/router"
import { type Component } from "solid-js"
import { classesBgGray } from "~ui/classes/classesBg"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { LayoutWrapperDemo } from "~ui/static/container/LayoutWrapperDemo"
import { Separator } from "~ui/static/separator/Separator"
import { classMerge } from "~ui/utils/ui/classMerge"
import type { MayHaveClass } from "~ui/utils/ui/MayHaveClass"
import type { MayHaveInnerClassName } from "~ui/utils/ui/MayHaveInnerClassName"
import { capitalizeFirstLetter } from "~utils/text/capitalizeFirstLetter"

interface SignUpPageProps extends MayHaveClass, MayHaveInnerClassName {}

export const SignUpPage: Component<SignUpPageProps> = (p) => {
  return (
    <LayoutWrapperDemo title={"Sign up - " + appName}>
      <div class={classMerge("min-h-dvh w-full", classesBgGray, p.class)}>
        <NavBarAuth />
        <div class={classMerge("container max-w-7xl mx-auto py-8 px-4", p.innerClass)}>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <AuthCoverIllustration />
            <div class="space-y-8">
              <h1 class="text-2xl font-bold text-center">Create new account</h1>
              <SignUpEmailPasswordSection />
              <Separator />
              <SignUpSocialSection />
              <Separator />
              <HaveAnAccountSection />
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapperDemo>
  )
}

function SignUpEmailPasswordSection() {
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSignUp(values: { name: string; email: string; password?: string; terms: boolean }) {
    // console.log("Sign up with email/password:", values)
    const result = await apiClientSignUp(values)
    if (!result.success) {
      toastAdd({ title: "Error signing up", description: result.errorMessage })
      return
    }
    const returnPath = urlSignInRedirectUrl(location.pathname)
    navigate(urlSignUpConfirmEmail(values.email, "", returnPath))
  }

  return (
    <section class="space-y-4 max-w-2xl">
      <h2 class="text-xl font-semibold">Sign up via Email/Password</h2>
      <SignUpEmailPasswordForm onSubmit={handleSignUp} />
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
