import { mdiHome } from "@adaptive-ds/mdi/mdiHome.js"
import { type ComponentProps, splitProps } from "solid-js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.jsx"

export function GoHomeLinkButton(p: Omit<ComponentProps<typeof LinkButtonInternal>, "to" | "href">) {
  const [s, rest] = splitProps(p, ["icon", "variant", "children"])
  return (
    <LinkButtonInternal icon={s.icon ?? mdiHome} to={"/"} variant={s.variant ?? buttonVariant.outline} {...rest}>
      {ttc("Take me home")}
    </LinkButtonInternal>
  )
}
