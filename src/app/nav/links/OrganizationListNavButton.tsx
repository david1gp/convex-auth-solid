import { classesActiveLink } from "@/app/nav/links/classesActiveLink"
import { urlOrgList } from "@/org/org_url/urlOrg"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

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
      {ttt("Stakeholders")}
    </LinkButton>
  )
}
