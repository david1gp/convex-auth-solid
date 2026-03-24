import type { SocialLoginProvider } from "#src/auth/model_field/socialLoginProvider.js"
import { socialProviderButtonProps } from "#src/auth/ui/sign_in/social/SocialProviderButtonProps.js"
import { urlAuthProvider } from "#src/auth/url/urlAuthProvider.js"
import { urlSignInRedirectUrl } from "#src/auth/url/urlSignInRedirectUrl.js"
import { buttonVariant, type ButtonSize } from "#ui/interactive/button/buttonCva.js"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import { capitalizeFirstLetter } from "#utils/text/capitalizeFirstLetter.js"

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
      variant={buttonVariant.filledIndigo}
      class={p.class}
      aria-label={text}
    >
      {text}
    </LinkButton>
  )
}
