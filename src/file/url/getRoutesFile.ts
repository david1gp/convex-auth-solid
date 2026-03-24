import type { PageNameFile } from "#src/file/url/pageNameFile.js"
import { pageRouteFile } from "#src/file/url/pageRouteFile.js"
import type { RouteComponent, RouteObject } from "#ui/utils/RouteConfig.js"
import { lazy } from "solid-js"

const ResourceFileAddPage = lazy(() =>
  import("#src/file/ui/mutate/ResourceFileAddPage.jsx").then((c) => ({ default: c.ResourceFileAddPage })),
)
const ResourceFileEditPage = lazy(() =>
  import("#src/file/ui/mutate/ResourceFileEditPage.jsx").then((c) => ({ default: c.ResourceFileEditPage })),
)

const ResourceFileRemovePage = lazy(() =>
  import("#src/file/ui/mutate/ResourceFileRemovePage.jsx").then((c) => ({ default: c.ResourceFileRemovePage })),
)

export function getRoutesFile(): RouteObject[] {
  const routeMapping = {
    resourceFileAdd: ResourceFileAddPage,
    resourceFileEdit: ResourceFileEditPage,
    resourceFileRemove: ResourceFileRemovePage,
  } as const satisfies Record<PageNameFile, RouteComponent>

  return Object.entries(routeMapping).map(([routeKey, component]) => ({
    path: pageRouteFile[routeKey as PageNameFile],
    component,
  }))
}
