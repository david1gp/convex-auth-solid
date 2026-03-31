import { classesActiveLink } from "#src/app/nav/links/classesActiveLink.ts"
import { urlOrgList } from "#src/org/org_url/urlOrg.ts"
import { ttt } from "#ui/i18n/ttt.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import { classArr } from "#ui/utils/classArr.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

export interface OrganizationListLinkButtonProps extends MayHaveClass {
  isActive?: boolean
}

export function OrganizationListNavButton(p: OrganizationListLinkButtonProps) {
  return (
    <LinkButton
      variant={buttonVariant.link}
      href={urlOrgList()}
      class={classArr(p.isActive && classesActiveLink, p.class)}
      aria-current={p.isActive ? "page" : undefined}
      aria-selected={p.isActive ? "true" : undefined}
      role="tab"
    >
      {ttt("Organizations")}
    </LinkButton>
  )
}
