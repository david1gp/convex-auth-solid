import type { PageNameOrg } from "@/org/url/pageNameOrg"

export type PageRouteOrg = keyof typeof pageRouteOrg

export const pageRouteOrg = {
  orgList: "/w/list",
  orgAdd: "/w/add",
  orgView: "/w/:orgHandle/view",
  orgEdit: "/w/:orgHandle/edit",
  orgRemove: "/w/:orgHandle/remove",
} as const satisfies Record<PageNameOrg, string>
