import type { PageNameWorkspace } from "@/workspace/url/pageNameWorkspace"
import { pageRouteWorkspace } from "@/workspace/url/pageRouteWorkspace"
import { lazy } from "solid-js"
import type { RouteComponent, RouteObject } from "~ui/utils/RouteConfig"

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
    workspaceList: WorkspaceListPage,
    workspaceAdd: WorkspaceAddPage,
    workspaceView: WorkspaceViewPage,
    workspaceEdit: WorkspaceEditPage,
    workspaceRemove: WorkspaceRemovePage,
  } as const satisfies Record<PageNameWorkspace, RouteComponent>
  return Object.entries(routeMapping).map(([routeKey, component]) => ({
    path: pageRouteWorkspace[routeKey as PageNameWorkspace],
    component,
  }))
}
