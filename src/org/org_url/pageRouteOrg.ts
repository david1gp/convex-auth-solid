import type { PageNameOrg } from "@/org/org_url/pageNameOrg"

export type PageRouteOrg = keyof typeof pageRouteOrg

export const pageRouteOrg = {
  orgList: "/org",
  orgAdd: "/org/create",
  orgView: "/org/:orgHandle",
  orgEdit: "/org/:orgHandle/edit",
  orgLeave: "/org/:orgHandle/leave",
  orgRemove: "/org/:orgHandle/remove",
} as const satisfies Record<PageNameOrg, string>
