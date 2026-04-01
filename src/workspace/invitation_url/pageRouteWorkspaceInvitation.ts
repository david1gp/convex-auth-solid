import type { PageNameWorkspaceInvitation } from "#src/workspace/invitation_url/pageNameWorkspaceInvitation.ts"

export type PageRouteWorkspaceInvitation = keyof typeof pageRouteWorkspaceInvitation

export const pageRouteWorkspaceInvitation = {
  workspaceInvitationList: "/workspace/:workspaceHandle/invitations",
  workspaceInvitationAdd: "/workspace/:workspaceHandle/invitations/add",
  workspaceInvitationAccept: "/invite/:invitationCode/accept",
} as const
