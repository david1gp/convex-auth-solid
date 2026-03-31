import type { PageNameOrgInvitation } from "#src/org/invitation_url/pageNameOrgInvitation.ts"
import { pageRouteOrgInvitation } from "#src/org/invitation_url/pageRouteOrgInvitation.ts"
import type { RouteComponent, RouteObject } from "#ui/utils/RouteConfig.ts"
import { objectEntries } from "#utils/obj/objectEntries.js"
import { lazy } from "solid-js"

const OrgInvitationListPage = lazy(() =>
  import("#src/org/invitation_ui/list/OrgInvitationListPage.tsx").then((c) => ({ default: c.OrgInvitationListPage })),
)
const OrgInvitationAddPage = lazy(() =>
  import("#src/org/invitation_ui/mutate/OrgInvitationAddPage.tsx").then((c) => ({ default: c.OrgInvitationAddPage })),
)
const OrgInvitationAcceptPage = lazy(() =>
  import("#src/org/invitation_ui/accept/OrgInvitationAcceptPage.tsx").then((c) => ({ default: c.OrgInvitationAcceptPage })),
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
