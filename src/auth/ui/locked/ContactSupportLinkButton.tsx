import { urlContactMailTo } from "@/app/text/urlContactMailTo"
import { mdiEmail } from "@mdi/js"
import { splitProps } from "solid-js"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import type { LinkButtonProps } from "~ui/interactive/link/LinkButtonProps"

export function ContactSupportLinkButton(p: Omit<LinkButtonProps, "href">) {
  const [, rest] = splitProps(p, [
    // "class",
    // "href",
    // "variant",
    // "size",
    // "newTab",
    // "isLoading",
    "icon",
    // "iconRight",
    // "iconClass",
    "children",
  ])
  return (
    <LinkButton icon={p.icon ?? mdiEmail} href={urlContactMailTo} {...rest}>
      Contact support
    </LinkButton>
  )
}
