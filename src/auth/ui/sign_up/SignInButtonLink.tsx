import { ttc } from "@/app/i18n/ttc"
import { urlPageSignIn } from "@/auth/url/pageRouteAuth"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { createUrl } from "@/utils/router/createUrl"
import { searchParamGet } from "@/utils/router/searchParamGet"
import { mdiArrowRight } from "@mdi/js"
import { splitProps } from "solid-js"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import type { LinkButtonProps } from "~ui/interactive/link/LinkButtonProps"

export interface SignInButtonLinkProps extends Omit<LinkButtonProps, "href"> {
  text?: string
}

export function SignInButtonLink(p: SignInButtonLinkProps) {
  const [s, rest] = splitProps(p, ["text", "children", "iconRight", "size", "variant"])

  function getUrl() {
    const url = createUrl()
    const email = searchParamGet("email", url) ?? ""
    const returnPath = searchParamGet("returnPath") || urlSignInRedirectUrl()
    return urlPageSignIn(email, returnPath)
  }
  return (
    <LinkButton
      href={getUrl()}
      iconRight={s.iconRight ?? mdiArrowRight}
      size={s.size ?? buttonSize.default}
      variant={s.variant ?? buttonVariant.default}
      {...rest}
    >
      {s.text ?? ttc("Sign In")}
    </LinkButton>
  )
}
