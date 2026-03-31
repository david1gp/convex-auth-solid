import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.tsx"
import { OrganizationListNavButton } from "#src/app/nav/links/OrganizationListNavButton.tsx"
import { ResourceListNavButton } from "#src/app/nav/links/ResourceListNavButton.tsx"
import { WorkspaceListLinkNavButton } from "#src/app/nav/links/WorkspaceListLinkNavButton.tsx"
import type { AppTab } from "#src/app/tabs/appTab.ts"
import { appTab } from "#src/app/tabs/appTab.ts"
import type { MayHaveChildren } from "#ui/utils/MayHaveChildren.ts"

export interface NavCenterProps extends MayHaveChildren {
  activeTab?: AppTab
  hasBreadcrumbs?: boolean
}

const tabOrder: AppTab[] = [appTab.org, appTab.workspace, appTab.resource]

export function NavCenter(p: NavCenterProps) {
  const maxIndex = tabOrder.length - 1
  const activeIndex = p.activeTab !== undefined ? Math.min(getTabIndex(p.activeTab), maxIndex) : -1

  if (activeIndex < 0) {
    return <>{p.children}</>
  }

  const hasBreadcrumbContent = p.hasBreadcrumbs ?? !!p.children
  const tabsBeforeActive = tabOrder.slice(0, activeIndex)
  const tabsAfterActive = tabOrder.slice(activeIndex + 1, maxIndex + 1)

  return (
    <>
      {tabsBeforeActive.map((tab) => (
        <NavButtonForTab tab={tab} isActive={false} />
      ))}
      <NavButtonForTab tab={p.activeTab!} isActive={!hasBreadcrumbContent} />
      {hasBreadcrumbContent && (
        <>
          <NavBreadcrumbSeparator />
          {p.children}
        </>
      )}
      {tabsAfterActive.map((tab) => (
        <NavButtonForTab tab={tab} isActive={false} />
      ))}
    </>
  )
}

function getTabIndex(tab: AppTab): number {
  return tabOrder.indexOf(tab)
}

function NavButtonForTab(p: { tab: AppTab; isActive?: boolean }) {
  switch (p.tab) {
    case appTab.org:
      return <OrganizationListNavButton isActive={p.isActive} />
    case appTab.workspace:
      return <WorkspaceListLinkNavButton isActive={p.isActive} />
    case appTab.resource:
      return <ResourceListNavButton isActive={p.isActive} />
  }
}
