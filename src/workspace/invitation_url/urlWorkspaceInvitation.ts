import { pageRouteWorkspaceInvitation } from "#src/workspace/invitation_url/pageRouteWorkspaceInvitation.ts"

export function urlWorkspaceInvitationList(workspaceHandle: string): string {
  return pageRouteWorkspaceInvitation.workspaceInvitationList.replace(":workspaceHandle", workspaceHandle)
}

export function urlWorkspaceInvitationAdd(workspaceHandle: string): string {
  return pageRouteWorkspaceInvitation.workspaceInvitationAdd.replace(":workspaceHandle", workspaceHandle)
}

export function urlWorkspaceInvitationAccept(invitationCode: string): string {
  return pageRouteWorkspaceInvitation.workspaceInvitationAccept.replace(":invitationCode", invitationCode)
}
