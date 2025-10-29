import type { PageNameOrg } from "@/org/url/pageNameOrg"
import { pageRouteOrg } from "@/org/url/pageRouteOrg"
import { lazy } from "solid-js"
import type { RouteComponent, RouteObject } from "~ui/utils/RouteConfig"
import { objectEntries } from "~utils/obj/objectEntries"

const OrgListPage = lazy(() =>
  import("@/org/ui/list/OrgListPage").then((c) => ({ default: c.OrgListPage })),
)
const OrgEditPage = lazy(() =>
  import("@/org/ui/mutate/OrgEditPage").then((c) => ({ default: c.OrgEditPage })),
)
const OrgViewPage = lazy(() =>
  import("@/ui/pages/TodoPage").then((c) => ({ default: c.TodoPage })),
)
const OrgAddPage = lazy(() =>
  import("@/org/ui/mutate/OrgAddPage").then((c) => ({ default: c.OrgAddPage })),
)
const OrgRemovePage = lazy(() =>
  import("@/org/ui/mutate/OrgDeletePage").then((c) => ({ default: c.OrgDeletePage })),
)

export function getRoutesOrg(): RouteObject[] {
  const routeMapping = {
    orgList: OrgListPage,
    orgAdd: OrgAddPage,
    orgView: OrgViewPage,
    orgEdit: OrgEditPage,
    orgRemove: OrgRemovePage,
  } as const satisfies Record<PageNameOrg, RouteComponent>
  return objectEntries(routeMapping).map(([routeKey, component]) => ({
    path: pageRouteOrg[routeKey as PageNameOrg],
    component,
  }))
}
