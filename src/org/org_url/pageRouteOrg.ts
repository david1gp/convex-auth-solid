import type { PageNameOrg } from "@/org/org_url/pageNameOrg"

export type PageRouteOrg = keyof typeof pageRouteOrg

export const pageRouteOrg = {
  orgList: "/org/list",
  orgAdd: "/org/add",
  orgView: "/org/:orgHandle/view",
  orgEdit: "/org/:orgHandle/edit",
  orgRemove: "/org/:orgHandle/remove",
} as const satisfies Record<PageNameOrg, string>
