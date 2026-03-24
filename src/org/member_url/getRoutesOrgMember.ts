import type { PageNameOrgMember } from "#src/org/member_url/pageNameOrgMember.js"
import { pageRouteOrgMember } from "#src/org/member_url/pageRouteOrgMember.js"
import type { RouteComponent, RouteObject } from "#ui/utils/RouteConfig.js"
import { objectEntries } from "#utils/obj/objectEntries.js"
import { lazy } from "solid-js"

const OrgMemberListPage = lazy(() =>
  import("#src/org/member_ui/list/OrgMemberListPage.jsx").then((c) => ({ default: c.OrgMemberListPage })),
)
const OrgMemberEditPage = lazy(() =>
  import("#src/org/member_ui/mutate/OrgMemberEditPage.jsx").then((c) => ({ default: c.OrgMemberEditPage })),
)
const OrgMemberViewPage = lazy(() => import("#src/ui/pages/TodoPage.jsx").then((c) => ({ default: c.TodoPage })))
const OrgMemberAddPage = lazy(() =>
  import("#src/org/member_ui/mutate/OrgMemberAddPage.jsx").then((c) => ({ default: c.OrgMemberAddPage })),
)
const OrgMemberRemovePage = lazy(() =>
  import("#src/org/member_ui/mutate/OrgMemberDeletePage.jsx").then((c) => ({ default: c.OrgMemberDeletePage })),
)

export function getRoutesOrgMember(): RouteObject[] {
  const routeMapping = {
    orgMemberList: OrgMemberListPage,
    orgMemberAdd: OrgMemberAddPage,
    orgMemberView: OrgMemberViewPage,
    orgMemberEdit: OrgMemberEditPage,
    orgMemberRemove: OrgMemberRemovePage,
  } as const satisfies Record<PageNameOrgMember, RouteComponent>
  return objectEntries(routeMapping).map(([routeKey, component]) => ({
    path: pageRouteOrgMember[routeKey as PageNameOrgMember],
    component,
  }))
}
