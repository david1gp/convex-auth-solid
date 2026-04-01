export type WorkspacePageSection = keyof typeof workspacePageSection

export const workspacePageSection = {
  workspace: "workspace",
  members: "members",
  invitations: "invitations",
} as const
