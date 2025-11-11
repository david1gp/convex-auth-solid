import { urlPageSignUp } from "@/auth/url/pageRouteAuth"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { createUrl } from "@/utils/router/createUrl"
import { searchParamGet } from "@/utils/router/searchParamGet"
import { mdiArrowRight } from "@mdi/js"
import { splitProps } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import type { LinkButtonProps } from "~ui/interactive/link/LinkButtonProps"

export interface SignUpButtonLinkProps extends Omit<LinkButtonProps, "href"> {
  text?: string
}

export function SignUpButtonLink(p: SignUpButtonLinkProps) {
  const [s, rest] = splitProps(p, ["text", "children", "iconRight", "size", "variant"])
  function getUrl() {
    const url = createUrl()
    const email = searchParamGet("email", url) ?? ""
    const returnPath = searchParamGet("returnPath") || urlSignInRedirectUrl()
    return urlPageSignUp(email, returnPath)
  }
  return (
    <LinkButton
      href={getUrl()}
      iconRight={s.iconRight ?? mdiArrowRight}
      size={s.size ?? buttonSize.default}
      variant={s.variant ?? buttonVariant.default}
      {...rest}
    >
      {s.text ?? ttt("Sign Up")}
    </LinkButton>
  )
}
