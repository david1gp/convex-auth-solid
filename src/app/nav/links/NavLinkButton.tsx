import { classesActiveLink } from "@/app/nav/links/classesActiveLink"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { classArr } from "~ui/utils/classArr"
import type { HasChildren } from "~ui/utils/HasChildren"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface NavLinkButtonProps extends HasChildren, MayHaveClass {
  href: string
  isActive: boolean
}

export function NavLinkButton(p: NavLinkButtonProps) {
  return (
    <LinkButton
      variant={buttonVariant.link}
      href={p.href}
      aria-current={!p.children ? "page" : undefined}
      aria-selected={!p.children ? "true" : undefined}
      role="tab"
      class={classArr(p.isActive && classesActiveLink, p.class)}
    >
      {p.children}
    </LinkButton>
  )
}
