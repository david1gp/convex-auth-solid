import { ttc } from "#src/app/i18n/ttc.js"
import { urlPageSignIn } from "#src/auth/url/pageRouteAuth.js"
import { urlSignInRedirectUrl } from "#src/auth/url/urlSignInRedirectUrl.js"
import { createUrl } from "#src/utils/router/createUrl.js"
import { searchParamGet } from "#src/utils/router/searchParamGet.js"
import { buttonSize, buttonVariant } from "#ui/interactive/button/buttonCva"
import { LinkButton } from "#ui/interactive/link/LinkButton"
import type { LinkButtonProps } from "#ui/interactive/link/LinkButtonProps"
import { mdiArrowRight } from "@mdi/js"
import { splitProps } from "solid-js"

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
      variant={s.variant ?? buttonVariant.contrast}
      {...rest}
    >
      {s.text ?? ttc("Sign In")}
    </LinkButton>
  )
}
