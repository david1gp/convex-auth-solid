import { ttc } from "#src/app/i18n/ttc.ts"
import { urlSupportMailTo } from "#src/app/url/urlSupport.ts"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import type { LinkButtonProps } from "#ui/interactive/link/LinkButtonProps.jsx"
import { mdiEmail } from "@mdi/js"
import { splitProps } from "solid-js"

export function ContactSupportLinkButton(p: Omit<LinkButtonProps, "href">) {
  const [s, rest] = splitProps(p, ["icon", "children"])
  return (
    <LinkButton icon={s.icon ?? mdiEmail} href={urlSupportMailTo} {...rest}>
      {ttc("Contact support")}
    </LinkButton>
  )
}
