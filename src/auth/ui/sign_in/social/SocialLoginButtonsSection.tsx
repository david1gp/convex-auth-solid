import { socialLoginProvider } from "@/auth/model/socialLoginProvider"
import { SocialLoginButton } from "@/auth/ui/sign_in/social/SocialLoginButton"
import { buttonSize } from "~ui/interactive/button/buttonCva"
import { classArr } from "~ui/utils/ui/classArr"
import type { MayHaveClass } from "~ui/utils/ui/MayHaveClass"

export interface SocialLoginButtonsProps extends MayHaveClass {
  redirectPath?: string
}

const signInUsingSocials = "signInUsingSocials"

export function SocialLoginButtonsSection(p: SocialLoginButtonsProps) {
  const buttonClasses = "justify-start text-xl"
  const btnSize = buttonSize.lg
  return (
    <section id={signInUsingSocials} class={classArr("flex flex-col gap-4 max-w-2xl", p.class)}>
      <h2 class="text-left">Sign in using social account</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SocialLoginButton provider={socialLoginProvider.google} size={btnSize} class={buttonClasses} />
        <SocialLoginButton provider={socialLoginProvider.github} size={btnSize} class={buttonClasses} />
      </div>
    </section>
  )
}
