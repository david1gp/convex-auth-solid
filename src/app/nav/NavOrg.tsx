import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavStatic } from "@/app/nav/NavStatic"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { OrganizationListNavButton } from "@/app/nav/links/OrganizationListNavButton"
import { WorkspaceListLinkNavButton } from "@/app/nav/links/WorkspaceListLinkNavButton"
import { orgNameGet } from "@/org/org_ui/orgNameRecordSignal"
import { urlOrgView } from "@/org/org_url/urlOrg"
import { Show, splitProps } from "solid-js"
import { SetPageTitle } from "~ui/static/meta/SetPageTitle"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface NavOrgProps extends NavOrgBreadcrumbsProps, MayHaveChildren, MayHaveClass {}

export function NavOrg(p: NavOrgProps) {
  const [s, rest] = splitProps(p, ["children", "class"])
  return (
    <NavStatic
      dense={true}
      class={p.class}
      childrenCenter={
        <>
          <div class="flex flex-wrap gap-2">
            <NavOrgBreadcrumbs {...rest}>{s.children}</NavOrgBreadcrumbs>
          </div>
          <WorkspaceListLinkNavButton />
        </>
      }
    />
  )
}

export interface NavOrgBreadcrumbsProps extends MayHaveChildren {
  orgHandle?: string
  getOrgPageTitle?: (orgName?: string) => string
}

function NavOrgBreadcrumbs(p: NavOrgBreadcrumbsProps) {
  return (
    <>
      <Show when={p.getOrgPageTitle}>
        {(getPageTitle) => <SetPageTitle title={getPageTitle()(p.orgHandle && orgNameGet(p.orgHandle))} />}
      </Show>
      {/* 1 */}
      <OrganizationListNavButton isActive={!p.orgHandle && !p.children} />
      {/* 2 */}
      <Show when={p.orgHandle && orgNameGet(p.orgHandle)}>
        {(orgName) => (
          <>
            <NavBreadcrumbSeparator />
            <NavLinkButton href={p.orgHandle ? urlOrgView(p.orgHandle) : ""} isActive={!p.children}>
              {orgName()}
            </NavLinkButton>
          </>
        )}
      </Show>
      {/* 3 */}
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
