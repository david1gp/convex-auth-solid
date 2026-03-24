import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.js"
import { NavCenter } from "#src/app/nav/NavCenter.js"
import { NavStatic } from "#src/app/nav/NavStatic.js"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.js"
import { OrganizationListNavButton } from "#src/app/nav/links/OrganizationListNavButton.js"
import { WorkspaceListLinkNavButton } from "#src/app/nav/links/WorkspaceListLinkNavButton.js"
import { orgNameGet } from "#src/org/org_ui/orgNameRecordSignal.js"
import { urlOrgView } from "#src/org/org_url/urlOrg.js"
import { SetPageTitle } from "#ui/static/meta/SetPageTitle"
import type { MayHaveChildren } from "#ui/utils/MayHaveChildren"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"
import { Show, splitProps } from "solid-js"

export interface NavOrgProps extends NavOrgBreadcrumbsProps, MayHaveChildren, MayHaveClass {}

export function NavOrg(p: NavOrgProps) {
  const [s, rest] = splitProps(p, ["children", "class"])
  return (
    <NavStatic
      dense={true}
      class={p.class}
      childrenCenter={
        <NavCenter>
          <NavOrgBreadcrumbs {...rest}>{s.children}</NavOrgBreadcrumbs>
          <WorkspaceListLinkNavButton />
        </NavCenter>
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
