export type PageNameWorkspaceMember = keyof typeof pageNameWorkspaceMember

export const pageNameWorkspaceMember = {
  workspaceMemberList: "workspaceMemberList",
  workspaceMemberAdd: "workspaceMemberAdd",
  workspaceMemberEdit: "workspaceMemberEdit",
  workspaceMemberDelete: "workspaceMemberDelete",
} as const