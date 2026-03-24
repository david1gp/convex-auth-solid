import type { PageNameFile } from "#src/file/url/pageNameFile.js"
import { pageRouteFile } from "#src/file/url/pageRouteFile.js"
import type { RouteComponent, RouteObject } from "#ui/utils/RouteConfig"
import { lazy } from "solid-js"

const ResourceFileAddPage = lazy(() =>
  import("#src/file/ui/mutate/ResourceFileAddPage.js").then((c) => ({ default: c.ResourceFileAddPage })),
)
const ResourceFileEditPage = lazy(() =>
  import("#src/file/ui/mutate/ResourceFileEditPage.js").then((c) => ({ default: c.ResourceFileEditPage })),
)

const ResourceFileRemovePage = lazy(() =>
  import("#src/file/ui/mutate/ResourceFileRemovePage.js").then((c) => ({ default: c.ResourceFileRemovePage })),
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
