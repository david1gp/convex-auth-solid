import { classesActiveLink } from "#src/app/nav/links/classesActiveLink.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import { classArr } from "#ui/utils/classArr.ts"
import type { HasChildren } from "#ui/utils/HasChildren.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

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
