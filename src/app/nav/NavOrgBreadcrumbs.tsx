import { orgListFindNameByHandle } from "@/org/org_ui/list/orgListSignal"
import { urlOrgView } from "@/org/org_url/urlOrg"
import { OrganizationsLinkButton } from "@/ui/links/OrganizationsLinkButton"
import { Show, type Accessor } from "solid-js"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { SetPageTitle } from "~ui/static/meta/SetPageTitle"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import { NavBreadcrumbSeparator } from "./NavBreadcrumbSeparator"

export interface NavOrgBreadcrumbsProps extends MayHaveChildren {
  orgHandle?: string
  getOrgName?: Accessor<string>
  getOrgPageTitle?: (orgName?: string) => string
}

export function NavOrgBreadcrumbs(p: NavOrgBreadcrumbsProps) {
  return (
    <>
      <NavBreadcrumbSeparator />
      <OrganizationsLinkButton />
      <Show when={p.getOrgPageTitle}>
        {(getPageTitle) => (
          <SetPageTitle
            title={getPageTitle()(
              p.orgHandle && (p.getOrgName ? p.getOrgName() : orgListFindNameByHandle(p.orgHandle)),
            )}
          />
        )}
      </Show>
      <Show when={p.orgHandle && (p.getOrgName ? p.getOrgName() : orgListFindNameByHandle(p.orgHandle))}>
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
