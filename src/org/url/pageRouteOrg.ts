import type { PageNameOrg } from "@/org/url/pageNameOrg"

export type PageRouteOrg = keyof typeof pageRouteOrg

export const pageRouteOrg = {
  orgList: "/w/list",
  orgAdd: "/w/add",
  orgView: "/w/:slug/view",
  orgEdit: "/w/:slug/edit",
  orgRemove: "/w/:slug/remove",
} as const satisfies Record<PageNameOrg, string>
