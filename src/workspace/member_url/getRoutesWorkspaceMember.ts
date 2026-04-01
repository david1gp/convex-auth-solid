import type { PageNameWorkspaceMember } from "#src/workspace/member_url/pageNameWorkspaceMember.ts"
import { pageRouteWorkspaceMember } from "#src/workspace/member_url/pageRouteWorkspaceMember.ts"
import type { RouteComponent, RouteObject } from "#ui/utils/RouteConfig.ts"
import { objectEntries } from "#utils/obj/objectEntries.js"
import { lazy } from "solid-js"

const WorkspaceMemberListPage = lazy(() =>
  import("#src/workspace/member_ui/list/WorkspaceMemberListPage.tsx").then((c) => ({ default: c.WorkspaceMemberListPage })),
)
const WorkspaceMemberEditPage = lazy(() =>
  import("#src/workspace/member_ui/mutate/WorkspaceMemberEditPage.tsx").then((c) => ({ default: c.WorkspaceMemberEditPage })),
)
const WorkspaceMemberAddPage = lazy(() =>
  import("#src/workspace/member_ui/mutate/WorkspaceMemberAddPage.tsx").then((c) => ({ default: c.WorkspaceMemberAddPage })),
)
const WorkspaceMemberRemovePage = lazy(() =>
  import("#src/workspace/member_ui/mutate/WorkspaceMemberDeletePage.tsx").then((c) => ({ default: c.WorkspaceMemberDeletePage })),
)

export function getRoutesWorkspaceMember(): RouteObject[] {
  const routeMapping = {
    workspaceMemberList: WorkspaceMemberListPage,
    workspaceMemberAdd: WorkspaceMemberAddPage,
    workspaceMemberEdit: WorkspaceMemberEditPage,
    workspaceMemberDelete: WorkspaceMemberRemovePage,
  } as const satisfies Record<PageNameWorkspaceMember, RouteComponent>
  return objectEntries(routeMapping).map(([routeKey, component]) => ({
    path: pageRouteWorkspaceMember[routeKey as PageNameWorkspaceMember],
    component,
  }))
}