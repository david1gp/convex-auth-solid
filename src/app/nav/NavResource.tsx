import { languageSignalGet } from "@/app/i18n/languageSignal"
import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavStatic } from "@/app/nav/NavStatic"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { OrganizationListNavButton } from "@/app/nav/links/OrganizationListNavButton"
import { ResourceListNavButton } from "@/app/nav/links/ResourceListNavButton"
import { WorkspaceListLinkNavButton } from "@/app/nav/links/WorkspaceListLinkNavButton"
import { resourceNameGet, resourceNameRecordSignalRegisterHandler } from "@/resource/ui/resourceNameRecordSignal"
import { urlResourceSiteList, urlResourceSiteView, urlResourceView } from "@/resource/url/urlResource"
import { Show, splitProps } from "solid-js"
import { SetPageTitle } from "~ui/static/meta/SetPageTitle"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface NavAppDirProps extends NavResourceBreadcrumbsProps, MayHaveChildren, MayHaveClass {}

export function NavResource(p: NavAppDirProps) {
  const [s, rest] = splitProps(p, ["children", "class"])
  return (
    <NavStatic
      dense={true}
      class={p.class}
      childrenCenter={
        <>
          <OrganizationListNavButton />
          <WorkspaceListLinkNavButton />
          <div class="flex flex-wrap gap-2">
            <NavResourceBreadcrumbs {...rest}>{s.children}</NavResourceBreadcrumbs>
          </div>
        </>
      }
      sitePath={getSitePath(p.resourceId)}
    />
  )
}

function getSitePath(resourceId?: string) {
  if (resourceId) {
    return urlResourceSiteView(languageSignalGet(), resourceId)
  }
  return urlResourceSiteList(languageSignalGet())
}

export interface NavResourceBreadcrumbsProps extends MayHaveChildren {
  resourceId?: string
  getResourcePageTitle?: (resourceName?: string) => string
}

function NavResourceBreadcrumbs(p: NavResourceBreadcrumbsProps) {
  resourceNameRecordSignalRegisterHandler()
  return (
    <>
      <Show when={p.getResourcePageTitle}>
        {(getPageTitle) => <SetPageTitle title={getPageTitle()(p.resourceId && resourceNameGet(p.resourceId))} />}
      </Show>
      {/* 1 */}
      <ResourceListNavButton isActive={!p.resourceId && !p.children} />
      {/* 2 */}
      <Show when={p.resourceId && resourceNameGet(p.resourceId)}>
        {(resourceName) => (
          <>
            <NavBreadcrumbSeparator />
            <NavLinkButton href={p.resourceId ? urlResourceView(p.resourceId) : ""} isActive={!p.children}>
              {resourceName()}
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
