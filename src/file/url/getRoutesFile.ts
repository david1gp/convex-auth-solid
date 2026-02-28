import type { PageNameFile } from "@/file/url/pageNameFile"
import { pageRouteFile } from "@/file/url/pageRouteFile"
import { lazy } from "solid-js"
import type { RouteComponent, RouteObject } from "~ui/utils/RouteConfig"

const ResourceFileAddPage = lazy(() =>
  import("@/file/ui/mutate/ResourceFileAddPage").then((c) => ({ default: c.ResourceFileAddPage })),
)
const ResourceFileEditPage = lazy(() =>
  import("@/file/ui/mutate/ResourceFileEditPage").then((c) => ({ default: c.ResourceFileEditPage })),
)

const ResourceFileRemovePage = lazy(() =>
  import("@/file/ui/mutate/ResourceFileRemovePage").then((c) => ({ default: c.ResourceFileRemovePage })),
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
