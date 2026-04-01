import type { PageNameWorkspace } from "#src/workspace/workspace_url/pageNameWorkspace.ts"
import { pageRouteWorkspace } from "#src/workspace/workspace_url/pageRouteWorkspace.ts"
import type { RouteComponent, RouteObject } from "#ui/utils/RouteConfig.ts"
import { lazy } from "solid-js"

const WorkspaceListPage = lazy(() =>
  import("#src/workspace/workspace_ui/list/WorkspaceListPage.tsx").then((c) => ({ default: c.WorkspaceListPage })),
)
const WorkspaceEditPage = lazy(() =>
  import("#src/workspace/workspace_ui/mutate/WorkspaceEditPage.tsx").then((c) => ({ default: c.WorkspaceEditPage })),
)
const WorkspaceViewPage = lazy(() =>
  import("#src/workspace/workspace_ui/view/WorkspaceViewPage.tsx").then((c) => ({ default: c.WorkspaceViewPage })),
)
const WorkspaceAddPage = lazy(() =>
  import("#src/workspace/workspace_ui/mutate/WorkspaceAddPage.tsx").then((c) => ({ default: c.WorkspaceAddPage })),
)
const WorkspaceRemovePage = lazy(() =>
  import("#src/workspace/workspace_ui/mutate/WorkspaceDeletePage.tsx").then((c) => ({ default: c.WorkspaceDeletePage })),
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
