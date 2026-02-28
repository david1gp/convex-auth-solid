import type { PageNameOrg } from "@/org/org_url/pageNameOrg"

export type PageRouteOrg = keyof typeof pageRouteOrg

export const pageRouteOrg = {
  orgList: "/stakeholders",
  orgAdd: "/stakeholders/create",
  orgView: "/stakeholders/:orgHandle",
  orgEdit: "/stakeholders/:orgHandle/edit",
  orgLeave: "/stakeholders/:orgHandle/leave",
  orgRemove: "/stakeholders/:orgHandle/remove",
} as const satisfies Record<PageNameOrg, string>
