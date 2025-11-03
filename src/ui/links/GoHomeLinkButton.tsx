import { mdiHome } from "@mdi/js"
import { splitProps } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import type { LinkButtonProps } from "~ui/interactive/link/LinkButtonProps"

export function GoHomeLinkButton(p: Omit<LinkButtonProps, "href">) {
  const [s, rest] = splitProps(p, ["icon", "variant", "children"])
  return (
    <LinkButton icon={s.icon ?? mdiHome} href={"/"} variant={s.variant ?? buttonVariant.outline} {...rest}>
      {ttt("Take me home")}
    </LinkButton>
  )
}
