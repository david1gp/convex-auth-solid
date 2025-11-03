import { urlContactMailTo } from "@/app/text/urlContactMailTo"
import { mdiEmail } from "@mdi/js"
import { splitProps } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import type { LinkButtonProps } from "~ui/interactive/link/LinkButtonProps"

export function ContactSupportLinkButton(p: Omit<LinkButtonProps, "href">) {
  const [s, rest] = splitProps(p, ["icon", "children"])
  return (
    <LinkButton icon={s.icon ?? mdiEmail} href={urlContactMailTo} {...rest}>
      {ttt("Contact support")}
    </LinkButton>
  )
}
