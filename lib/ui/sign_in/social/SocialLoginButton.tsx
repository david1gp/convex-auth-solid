import type { SocialLoginProvider } from "~auth/model/socialLoginProvider"
import { socialProviderButtonProps } from "~auth/ui/sign_in/social/SocialProviderButtonProps"
import { urlAuthProvider } from "~auth/url/urlAuthProvider"
import { urlSignInRedirectUrl } from "~auth/url/urlSignInRedirectUrl"
import { buttonVariant, type ButtonSize } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import type { MayHaveClass } from "~ui/utils/ui/MayHaveClass"
import { capitalizeFirstLetter } from "~utils/text/capitalizeFirstLetter"

export interface SocialLoginButtonProps extends MayHaveClass {
  provider: SocialLoginProvider
  size?: ButtonSize
}

export function SocialLoginButton(p: SocialLoginButtonProps) {
  const props = socialProviderButtonProps[p.provider]
  const { background, mdiIconPath } = props
  const currentUrl = urlSignInRedirectUrl()
  const text = "Sign in with " + capitalizeFirstLetter(p.provider)
  const url = urlAuthProvider(p.provider, currentUrl)
  return (
    <LinkButton
      href={url}
      icon={mdiIconPath}
      iconClass={"fill-white"}
      size={p.size}
      style={{ background: background }}
      variant={buttonVariant.primary}
      class={p.class}
      aria-label={text}
    >
      {text}
    </LinkButton>
  )
}
