import type { PageNameWorkspaceMember } from "#src/workspace/member_url/pageNameWorkspaceMember.ts"

export type PageRouteWorkspaceMember = keyof typeof pageRouteWorkspaceMember

export const pageRouteWorkspaceMember = {
  workspaceMemberList: "/workspace/:workspaceHandle/members",
  workspaceMemberAdd: "/workspace/:workspaceHandle/members/add",
  workspaceMemberEdit: "/workspace/:workspaceHandle/members/:memberId/edit",
  workspaceMemberDelete: "/workspace/:workspaceHandle/members/:memberId/delete",
} as const satisfies Record<PageNameWorkspaceMember, string>