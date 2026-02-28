export type PageNameResource = keyof typeof pageNameResource

export const pageNameResource = {
  resourceList: "resourceList",
  resourceAdd: "resourceAdd",
  resourceView: "resourceView",
  resourceEdit: "resourceEdit",
  resourceRemove: "resourceRemove",
} as const
