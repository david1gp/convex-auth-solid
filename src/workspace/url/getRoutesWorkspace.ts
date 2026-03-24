import type { PageNameWorkspace } from "#src/workspace/url/pageNameWorkspace.js"
import { pageRouteWorkspace } from "#src/workspace/url/pageRouteWorkspace.js"
import type { RouteComponent, RouteObject } from "#ui/utils/RouteConfig"
import { lazy } from "solid-js"

const WorkspaceListPage = lazy(() =>
  import("#src/workspace/ui/list/WorkspaceListPage.js").then((c) => ({ default: c.WorkspaceListPage })),
)
const WorkspaceEditPage = lazy(() =>
  import("#src/workspace/ui/mutate/WorkspaceEditPage.js").then((c) => ({ default: c.WorkspaceEditPage })),
)
const WorkspaceViewPage = lazy(() =>
  import("#src/workspace/ui/view/WorkspaceViewPage.js").then((c) => ({ default: c.WorkspaceViewPage })),
)
const WorkspaceAddPage = lazy(() =>
  import("#src/workspace/ui/mutate/WorkspaceAddPage.js").then((c) => ({ default: c.WorkspaceAddPage })),
)
const WorkspaceRemovePage = lazy(() =>
  import("#src/workspace/ui/mutate/WorkspaceDeletePage.js").then((c) => ({ default: c.WorkspaceDeletePage })),
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
