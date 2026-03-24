import type { PageNameOrg } from "#src/org/org_url/pageNameOrg.js"
import { pageRouteOrg } from "#src/org/org_url/pageRouteOrg.js"
import type { RouteComponent, RouteObject } from "#ui/utils/RouteConfig.js"
import { objectEntries } from "#utils/obj/objectEntries.js"
import { lazy } from "solid-js"

const OrgListPage = lazy(() => import("#src/org/org_ui/list/OrgListPage.jsx").then((c) => ({ default: c.OrgListPage })))
const OrgEditPage = lazy(() => import("#src/org/org_ui/mutate/OrgEditPage.jsx").then((c) => ({ default: c.OrgEditPage })))
const OrgViewPage = lazy(() => import("#src/org/org_ui/view/OrgViewPage.jsx").then((c) => ({ default: c.OrgViewPage })))
const OrgAddPage = lazy(() => import("#src/org/org_ui/mutate/OrgAddPage.jsx").then((c) => ({ default: c.OrgAddPage })))
const OrgRemovePage = lazy(() =>
  import("#src/org/org_ui/mutate/OrgDeletePage.jsx").then((c) => ({ default: c.OrgDeletePage })),
)
const OrgLeavePage = lazy(() => import("#src/org/org_ui/mutate/OrgLeavePage.jsx").then((c) => ({ default: c.OrgLeavePage })))

export function getRoutesOrg(): RouteObject[] {
  const routeMapping = {
    orgList: OrgListPage,
    orgAdd: OrgAddPage,
    orgView: OrgViewPage,
    orgEdit: OrgEditPage,
    orgLeave: OrgLeavePage,
    orgRemove: OrgRemovePage,
  } as const satisfies Record<PageNameOrg, RouteComponent>
  return objectEntries(routeMapping).map(([routeKey, component]) => ({
    path: pageRouteOrg[routeKey as PageNameOrg],
    component,
  }))
}
