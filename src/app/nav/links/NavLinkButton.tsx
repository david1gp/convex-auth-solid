import { classesActiveLink } from "#src/app/nav/links/classesActiveLink.js"
import { buttonVariant } from "#ui/interactive/button/buttonCva.js"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import { classArr } from "#ui/utils/classArr.js"
import type { HasChildren } from "#ui/utils/HasChildren.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"

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
