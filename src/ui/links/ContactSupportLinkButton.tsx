import { ttc } from "@/app/i18n/ttc"
import { urlSupportMailTo } from "@/app/url/urlSupport"
import { mdiEmail } from "@mdi/js"
import { splitProps } from "solid-js"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import type { LinkButtonProps } from "~ui/interactive/link/LinkButtonProps"

export function ContactSupportLinkButton(p: Omit<LinkButtonProps, "href">) {
  const [s, rest] = splitProps(p, ["icon", "children"])
  return (
    <LinkButton icon={s.icon ?? mdiEmail} href={urlSupportMailTo} {...rest}>
      {ttc("Contact support")}
    </LinkButton>
  )
}
