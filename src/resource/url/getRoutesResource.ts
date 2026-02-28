import type { PageNameResource } from "@/resource/url/pageNameResource"
import { pageRouteResource } from "@/resource/url/pageRouteResource"
import { lazy } from "solid-js"
import type { RouteComponent, RouteObject } from "~ui/utils/RouteConfig"

const ResourceListPage = lazy(() =>
  import("@/resource/ui/list/ResourceListPage").then((c) => ({ default: c.ResourceListPage })),
)
const ResourceEditPage = lazy(() =>
  import("@/resource/ui/mutate/ResourceEditPage").then((c) => ({ default: c.ResourceEditPage })),
)
const ResourceViewPage = lazy(() =>
  import("@/resource/ui/view/ResourceViewPage").then((c) => ({ default: c.ResourceViewPage })),
)
const ResourceAddPage = lazy(() =>
  import("@/resource/ui/mutate/ResourceAddPage").then((c) => ({ default: c.ResourceAddPage })),
)
const ResourceRemovePage = lazy(() =>
  import("@/resource/ui/mutate/ResourceDeletePage").then((c) => ({ default: c.ResourceDeletePage })),
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
