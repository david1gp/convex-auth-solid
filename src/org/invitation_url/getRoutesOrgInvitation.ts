import type { PageNameOrgInvitation } from "@/org/invitation_url/pageNameOrgInvitation"
import { pageRouteOrgInvitation } from "@/org/invitation_url/pageRouteOrgInvitation"
import { lazy } from "solid-js"
import type { RouteComponent, RouteObject } from "~ui/utils/RouteConfig"
import { objectEntries } from "~utils/obj/objectEntries"

const OrgInvitationListPage = lazy(() =>
  import("@/org/invitation_ui/list/OrgInvitationListPage").then((c) => ({ default: c.OrgInvitationListPage })),
)
const OrgInvitationAddPage = lazy(() =>
  import("@/org/invitation_ui/mutate/OrgInvitationAddPage").then((c) => ({ default: c.OrgInvitationAddPage })),
)
const OrgInvitationViewPage = lazy(() =>
  import("@/org/invitation_ui/accept/OrgInvitationAcceptPage").then((c) => ({ default: c.OrgInvitationAcceptPage })),
)

export function getRoutesOrgInvitation(): RouteObject[] {
  const routeMapping = {
    orgInvitationList: OrgInvitationListPage,
    orgInvitationAdd: OrgInvitationAddPage,
    orgInvitationAccept: OrgInvitationViewPage,
  } as const satisfies Record<PageNameOrgInvitation, RouteComponent>
  return objectEntries(routeMapping).map(([routeKey, component]) => ({
    path: pageRouteOrgInvitation[routeKey as PageNameOrgInvitation],
    component,
  }))
}
