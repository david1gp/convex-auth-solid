import type { PageNameOrg } from "@/org/org_url/pageNameOrg"

export type PageRouteOrg = keyof typeof pageRouteOrg

export const pageRouteOrg = {
  orgList: "/organizations",
  orgAdd: "/organizations/create",
  orgView: "/organizations/:orgHandle",
  orgEdit: "/organizations/:orgHandle/edit",
  orgRemove: "/organizations/:orgHandle/remove",
} as const satisfies Record<PageNameOrg, string>
