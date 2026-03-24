import type { PageNameOrgInvitation } from "#src/org/invitation_url/pageNameOrgInvitation.js"
import { pageRouteOrgInvitation } from "#src/org/invitation_url/pageRouteOrgInvitation.js"
import type { RouteComponent, RouteObject } from "#ui/utils/RouteConfig.js"
import { objectEntries } from "#utils/obj/objectEntries.js"
import { lazy } from "solid-js"

const OrgInvitationListPage = lazy(() =>
  import("#src/org/invitation_ui/list/OrgInvitationListPage.jsx").then((c) => ({ default: c.OrgInvitationListPage })),
)
const OrgInvitationAddPage = lazy(() =>
  import("#src/org/invitation_ui/mutate/OrgInvitationAddPage.jsx").then((c) => ({ default: c.OrgInvitationAddPage })),
)
const OrgInvitationAcceptPage = lazy(() =>
  import("#src/org/invitation_ui/accept/OrgInvitationAcceptPage.jsx").then((c) => ({ default: c.OrgInvitationAcceptPage })),
)

export function getRoutesOrgInvitation(): RouteObject[] {
  const routeMapping = {
    orgInvitationList: OrgInvitationListPage,
    orgInvitationAdd: OrgInvitationAddPage,
    orgInvitationAccept: OrgInvitationAcceptPage,
  } as const satisfies Record<PageNameOrgInvitation, RouteComponent>
  return objectEntries(routeMapping).map(([routeKey, component]) => ({
    path: pageRouteOrgInvitation[routeKey as PageNameOrgInvitation],
    component,
  }))
}
