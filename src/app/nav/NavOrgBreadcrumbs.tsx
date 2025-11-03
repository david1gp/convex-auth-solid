import { orgListFindNameByHandle } from "@/org/org_ui/list/orgListSignal"
import { urlOrgView } from "@/org/org_url/urlOrg"
import { OrganizationsLinkButton } from "@/ui/links/OrganizationsLinkButton"
import { Show } from "solid-js"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { SetPageTitle } from "~ui/static/meta/SetPageTitle"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import { NavBreadcrumbSeparator } from "./NavBreadcrumbSeparator"

export interface NavOrgBreadcrumbsProps extends MayHaveChildren {
  orgHandle?: string
  getOrgName?: (orgHandle: string) => string
  getOrgPageTitle?: (orgName?: string) => string
}

export function NavOrgBreadcrumbs(p: NavOrgBreadcrumbsProps) {
  function getOrgName(orgHandle: string) {
    if (p.getOrgName) return p.getOrgName(orgHandle)
    return orgListFindNameByHandle(orgHandle)
  }
  return (
    <>
      <NavBreadcrumbSeparator />
      <OrganizationsLinkButton />
      <Show when={p.getOrgPageTitle}>
        {(getPageTitle) => <SetPageTitle title={getPageTitle()(p.orgHandle && getOrgName(p.orgHandle))} />}
      </Show>
      <Show when={p.orgHandle && getOrgName(p.orgHandle)}>
        {(orgName) => (
          <>
            <NavBreadcrumbSeparator />
            <LinkButton variant={buttonVariant.link} href={p.orgHandle ? urlOrgView(p.orgHandle) : ""}>
              {orgName()}
            </LinkButton>
          </>
        )}
      </Show>
      <Show when={p.children}>
        {(getChildren) => (
          <>
            <NavBreadcrumbSeparator />
            {getChildren()}
          </>
        )}
      </Show>
    </>
  )
}
