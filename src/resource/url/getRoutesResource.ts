import type { PageNameResource } from "#src/resource/url/pageNameResource.js"
import { pageRouteResource } from "#src/resource/url/pageRouteResource.js"
import type { RouteComponent, RouteObject } from "#ui/utils/RouteConfig.js"
import { lazy } from "solid-js"

const ResourceListPage = lazy(() =>
  import("#src/resource/ui/list/ResourceListPage.jsx").then((c) => ({ default: c.ResourceListPage })),
)
const ResourceEditPage = lazy(() =>
  import("#src/resource/ui/mutate/ResourceEditPage.jsx").then((c) => ({ default: c.ResourceEditPage })),
)
const ResourceViewPage = lazy(() =>
  import("#src/resource/ui/view/ResourceViewPage.jsx").then((c) => ({ default: c.ResourceViewPage })),
)
const ResourceAddPage = lazy(() =>
  import("#src/resource/ui/mutate/ResourceAddPage.jsx").then((c) => ({ default: c.ResourceAddPage })),
)
const ResourceRemovePage = lazy(() =>
  import("#src/resource/ui/mutate/ResourceDeletePage.jsx").then((c) => ({ default: c.ResourceDeletePage })),
)

export function getRoutesResource(): RouteObject[] {
  const routeMapping = {
    resourceList: ResourceListPage,
    resourceAdd: ResourceAddPage,
    resourceView: ResourceViewPage,
    resourceEdit: ResourceEditPage,
    resourceRemove: ResourceRemovePage,
  } as const satisfies Record<PageNameResource, RouteComponent>
  return Object.entries(routeMapping).map(([routeKey, component]) => ({
    path: pageRouteResource[routeKey as PageNameResource],
    component,
  }))
}
