import type { PageNameOrg } from "@/org/url/pageNameOrg"
import { pageRouteOrg } from "@/org/url/pageRouteOrg"
import { lazy } from "solid-js"
import type { RouteComponent, RouteObject } from "~ui/utils/RouteConfig"
import { objectEntries } from "~utils/obj/objectEntries"

const WorkspaceListPage = lazy(() =>
  import("@/workspace/ui/list/WorkspaceListPage").then((c) => ({ default: c.WorkspaceListPage })),
)
const WorkspaceEditPage = lazy(() =>
  import("@/workspace/ui/mutate/WorkspaceEditPage").then((c) => ({ default: c.WorkspaceEditPage })),
)
const WorkspaceViewPage = lazy(() =>
  import("@/workspace/ui/view/WorkspaceViewPage").then((c) => ({ default: c.WorkspaceViewPage })),
)
const WorkspaceAddPage = lazy(() =>
  import("@/workspace/ui/mutate/WorkspaceAddPage").then((c) => ({ default: c.WorkspaceAddPage })),
)
const WorkspaceRemovePage = lazy(() =>
  import("@/workspace/ui/mutate/WorkspaceDeletePage").then((c) => ({ default: c.WorkspaceDeletePage })),
)

export function getRoutesWorkspace(): RouteObject[] {
  const routeMapping = {
    orgList: WorkspaceListPage,
    orgAdd: WorkspaceAddPage,
    orgView: WorkspaceViewPage,
    orgEdit: WorkspaceEditPage,
    orgRemove: WorkspaceRemovePage,
  } as const satisfies Record<PageNameOrg, RouteComponent>
  return objectEntries(routeMapping).map(([routeKey, component]) => ({
    path: pageRouteOrg[routeKey as PageNameOrg],
    component,
  }))
}
