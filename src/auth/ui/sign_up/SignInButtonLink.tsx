import { urlPageSignIn } from "@/auth/url/pageRouteAuth"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { getSearchParamAsString } from "@/utils/ui/router/getSearchParam"
import { useSearchParamsObject } from "@/utils/ui/router/useSearchParamsObject"
import { mdiArrowRight } from "@mdi/js"
import { splitProps } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import type { LinkButtonProps } from "~ui/interactive/link/LinkButtonProps"

export interface SignInButtonLinkProps extends Omit<LinkButtonProps, "href"> {
  text?: string
}

export function SignInButtonLink(p: SignInButtonLinkProps) {
  const [s, rest] = splitProps(p, ["text", "children", "iconRight", "size", "variant"])
  const searchParams = useSearchParamsObject()

  function getUrl() {
    const email = getSearchParamAsString(searchParams, "email")
    const returnPath = getSearchParamAsString(searchParams, "returnPath") || urlSignInRedirectUrl()
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
      {s.text ?? ttt("Sign In")}
    </LinkButton>
  )
}
