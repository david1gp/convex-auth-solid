import { ttc } from "#src/app/i18n/ttc.ts"
import { urlPageSignUp } from "#src/auth/url/pageRouteAuth.ts"
import { urlSignInRedirectUrl } from "#src/auth/url/urlSignInRedirectUrl.ts"
import { createUrl } from "#src/utils/router/createUrl.ts"
import { searchParamGet } from "#src/utils/router/searchParamGet.ts"
import { buttonSize, buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.jsx"
import { mdiArrowRight } from "@mdi/js"
import { splitProps, type ComponentProps } from "solid-js"

export interface SignUpButtonLinkProps extends Omit<ComponentProps<typeof LinkButtonInternal>, "to" | "href"> {
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
    <LinkButtonInternal
      to={getUrl()}
      iconRight={s.iconRight ?? mdiArrowRight}
      size={s.size ?? buttonSize.default}
      variant={s.variant ?? buttonVariant.contrast}
      {...rest}
    >
      {s.text ?? ttc("Sign Up")}
    </LinkButtonInternal>
  )
}
