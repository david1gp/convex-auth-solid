import { socialLoginProvider } from "@/auth/model_field/socialLoginProvider"
import { urlAuthProvider } from "@/auth/url/urlAuthProvider"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { mdiGithub, mdiGoogle } from "@mdi/js"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { capitalizeFirstLetter } from "~utils/text/capitalizeFirstLetter"

interface SocialSignInButtonProps extends MayHaveClass {
  provider: keyof typeof socialLoginProvider
}

function SocialSignInButton(p: SocialSignInButtonProps) {
  const providerConfig = socialLoginProvider[p.provider]
  const currentUrl = urlSignInRedirectUrl()
  const url = urlAuthProvider(p.provider, currentUrl)
  const iconPath = p.provider === "google" ? mdiGoogle : mdiGithub
  const text = `Sign in with ${capitalizeFirstLetter(p.provider)}`

  return (
    <LinkButton
      href={url}
      icon={iconPath}
      iconClass="size-8"
      size={buttonSize.lg}
      variant={buttonVariant.primary}
      class={classMerge(
        "justify-start",
        p.provider === "google" ? "bg-red-500 hover:bg-red-600" : "bg-gray-800 hover:bg-gray-900",
        "text-white",
      )}
      aria-label={text}
    >
      {text}
    </LinkButton>
  )
}

export function SocialSignInButtons() {
  return (
    <div class="space-y-4">
      <SocialSignInButton provider="google" />
      <SocialSignInButton provider="github" />
    </div>
  )
}
