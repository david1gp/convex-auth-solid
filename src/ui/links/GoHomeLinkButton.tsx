import { ttc } from "#src/app/i18n/ttc.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import type { LinkButtonProps } from "#ui/interactive/link/LinkButtonProps.jsx"
import { mdiHome } from "@mdi/js"
import { splitProps } from "solid-js"

export function GoHomeLinkButton(p: Omit<LinkButtonProps, "href">) {
  const [s, rest] = splitProps(p, ["icon", "variant", "children"])
  return (
    <LinkButton icon={s.icon ?? mdiHome} href={"/"} variant={s.variant ?? buttonVariant.outline} {...rest}>
      {ttc("Take me home")}
    </LinkButton>
  )
}
