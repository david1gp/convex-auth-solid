import type { PageNameOrgMember } from "@/org/member_url/pageNameOrgMember"
import { pageRouteOrgMember } from "@/org/member_url/pageRouteOrgMember"
import { lazy } from "solid-js"
import type { RouteComponent, RouteObject } from "~ui/utils/RouteConfig"
import { objectEntries } from "~utils/obj/objectEntries"

const OrgMemberListPage = lazy(() =>
  import("@/org/member_ui/list/OrgMemberListPage").then((c) => ({ default: c.OrgMemberListPage })),
)
const OrgMemberEditPage = lazy(() =>
  import("@/org/member_ui/mutate/OrgMemberEditPage").then((c) => ({ default: c.OrgMemberEditPage })),
)
const OrgMemberViewPage = lazy(() => import("@/ui/pages/TodoPage").then((c) => ({ default: c.TodoPage })))
const OrgMemberAddPage = lazy(() =>
  import("@/org/member_ui/mutate/OrgMemberAddPage").then((c) => ({ default: c.OrgMemberAddPage })),
)
const OrgMemberRemovePage = lazy(() =>
  import("@/org/member_ui/mutate/OrgMemberDeletePage").then((c) => ({ default: c.OrgMemberDeletePage })),
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
