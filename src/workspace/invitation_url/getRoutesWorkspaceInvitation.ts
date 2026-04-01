import type { PageNameWorkspaceInvitation } from "#src/workspace/invitation_url/pageNameWorkspaceInvitation.ts"
import { pageRouteWorkspaceInvitation } from "#src/workspace/invitation_url/pageRouteWorkspaceInvitation.ts"
import type { RouteComponent, RouteObject } from "#ui/utils/RouteConfig.ts"
import { objectEntries } from "#utils/obj/objectEntries.js"
import { lazy } from "solid-js"

const WorkspaceInvitationListPage = lazy(() =>
  import("#src/workspace/invitation_ui/list/WorkspaceInvitationListPage.tsx").then((c) => ({ default: c.WorkspaceInvitationListPage })),
)
const WorkspaceInvitationAddPage = lazy(() =>
  import("#src/workspace/invitation_ui/mutate/WorkspaceInvitationAddPage.tsx").then((c) => ({ default: c.WorkspaceInvitationAddPage })),
)
const WorkspaceInvitationAcceptPage = lazy(() =>
  import("#src/workspace/invitation_ui/accept/WorkspaceInvitationAcceptPage.tsx").then((c) => ({ default: c.WorkspaceInvitationAcceptPage })),
)

export function getRoutesWorkspaceInvitation(): RouteObject[] {
  const routeMapping = {
    workspaceInvitationList: WorkspaceInvitationListPage,
    workspaceInvitationAdd: WorkspaceInvitationAddPage,
    workspaceInvitationAccept: WorkspaceInvitationAcceptPage,
  } as const satisfies Record<"workspaceInvitationList" | "workspaceInvitationAdd" | "workspaceInvitationAccept", RouteComponent>
  return objectEntries(routeMapping).map(([routeKey, component]) => ({
    path: pageRouteWorkspaceInvitation[routeKey as keyof typeof pageRouteWorkspaceInvitation],
    component,
  }))
}
