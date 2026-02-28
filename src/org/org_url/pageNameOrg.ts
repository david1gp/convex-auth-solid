export type PageNameOrg = keyof typeof pageNameOrg

export const pageNameOrg = {
  orgList: "orgList",
  orgAdd: "orgAdd",
  orgView: "orgView",
  orgEdit: "orgEdit",
  orgLeave: "orgLeave",
  orgRemove: "orgRemove",
} as const
