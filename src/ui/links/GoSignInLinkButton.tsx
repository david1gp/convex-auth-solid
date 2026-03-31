import { ttc } from "#src/app/i18n/ttc.ts"
import { urlPageSignIn } from "#src/auth/url/pageRouteAuth.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import type { LinkButtonProps } from "#ui/interactive/link/LinkButtonProps.jsx"
import { mdiHome } from "@mdi/js"
import { splitProps } from "solid-js"

export function GoSignInLinkButton(p: Omit<LinkButtonProps, "href">) {
  const [s, rest] = splitProps(p, ["icon", "children", "variant"])
  return (
    <LinkButton icon={s.icon ?? mdiHome} href={urlPageSignIn()} variant={s.variant ?? buttonVariant.outline} {...rest}>
      {ttc("Go to Sign-In")}
    </LinkButton>
  )
}
