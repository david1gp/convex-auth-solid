export type PageNameWorkspaceInvitation = keyof typeof pageNameWorkspaceInvitation

export const pageNameWorkspaceInvitation = {
  workspaceInvitationList: "workspaceInvitationList",
  workspaceInvitationAdd: "workspaceInvitationAdd",
  workspaceInvitationAccept: "workspaceInvitationAccept",
  workspaceInvitationDismiss: "workspaceInvitationDismiss",
} as const
