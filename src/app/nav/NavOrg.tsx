import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.tsx"
import { NavCenter } from "#src/app/nav/NavCenter.tsx"
import { NavStatic } from "#src/app/nav/NavStatic.tsx"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { OrganizationListNavButton } from "#src/app/nav/links/OrganizationListNavButton.tsx"
import { WorkspaceListLinkNavButton } from "#src/app/nav/links/WorkspaceListLinkNavButton.tsx"
import { orgNameGet } from "#src/org/org_ui/orgNameRecordSignal.ts"
import { urlOrgView } from "#src/org/org_url/urlOrg.ts"
import { SetPageTitle } from "#ui/static/meta/SetPageTitle.jsx"
import type { MayHaveChildren } from "#ui/utils/MayHaveChildren.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
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
