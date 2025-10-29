export type PageNameOrgMember = keyof typeof pageNameOrgMember

export const pageNameOrgMember = {
  orgMemberList: "orgMemberList",
  orgMemberAdd: "orgMemberAdd",
  orgMemberView: "orgMemberView",
  orgMemberEdit: "orgMemberEdit",
  orgMemberRemove: "orgMemberRemove",
} as const