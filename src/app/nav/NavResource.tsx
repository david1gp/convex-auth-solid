import { languageSignalGet } from "#src/app/i18n/languageSignal.ts"
import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.tsx"
import { NavCenter } from "#src/app/nav/NavCenter.tsx"
import { NavStatic } from "#src/app/nav/NavStatic.tsx"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { ResourceListNavButton } from "#src/app/nav/links/ResourceListNavButton.tsx"
import { resourceNameGet, resourceNameRecordSignalRegisterHandler } from "#src/resource/ui/resourceNameRecordSignal.ts"
import { urlResourceSiteList, urlResourceSiteView, urlResourceView } from "#src/resource/url/urlResource.ts"
import { SetPageTitle } from "#ui/static/meta/SetPageTitle.jsx"
import type { MayHaveChildren } from "#ui/utils/MayHaveChildren.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { Show, splitProps } from "solid-js"

export interface NavAppDirProps extends NavResourceBreadcrumbsProps, MayHaveChildren, MayHaveClass {}

export function NavResource(p: NavAppDirProps) {
  const [s, rest] = splitProps(p, ["children", "class"])
  return (
    <NavStatic
      dense={true}
      class={p.class}
      childrenCenter={
        <NavCenter>
          <div class="flex flex-wrap gap-2">
            <NavResourceBreadcrumbs {...rest}>{s.children}</NavResourceBreadcrumbs>
          </div>
        </NavCenter>
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
