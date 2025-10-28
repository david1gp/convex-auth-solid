export type PageNameOrg = keyof typeof pageNameOrg

export const pageNameOrg = {
  orgList: "orgList",
  orgAdd: "orgAdd",
  orgView: "orgView",
  orgEdit: "orgEdit",
  orgRemove: "orgRemove",
} as const
