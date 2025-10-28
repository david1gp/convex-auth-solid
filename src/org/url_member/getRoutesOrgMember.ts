import type { PageNameOrgMember } from "@/org/url_member/pageNameOrgMember"
import { pageRouteOrgMember } from "@/org/url_member/pageRouteOrgMember"
import { lazy } from "solid-js"
import type { RouteComponent, RouteObject } from "~ui/utils/RouteConfig"
import { objectEntries } from "~utils/obj/objectEntries"

const OrgMemberListPage = lazy(() =>
  import("@/org/ui_members/list/OrgMemberListPage").then((c) => ({ default: c.OrgMemberListPage })),
)
const OrgMemberEditPage = lazy(() =>
  import("@/org/ui_members/mutate/OrgMemberEditPage").then((c) => ({ default: c.OrgMemberEditPage })),
)
const OrgMemberViewPage = lazy(() =>
  import("@/app/demos/TodoPage").then((c) => ({ default: c.TodoPage })),
)
const OrgMemberAddPage = lazy(() =>
  import("@/org/ui_members/mutate/OrgMemberAddPage").then((c) => ({ default: c.OrgMemberAddPage })),
)
const OrgMemberRemovePage = lazy(() =>
  import("@/org/ui_members/mutate/OrgMemberDeletePage").then((c) => ({ default: c.OrgMemberDeletePage })),
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
