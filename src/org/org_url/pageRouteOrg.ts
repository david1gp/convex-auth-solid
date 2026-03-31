import type { PageNameOrg } from "#src/org/org_url/pageNameOrg.ts"

export type PageRouteOrg = keyof typeof pageRouteOrg

export const pageRouteOrg = {
  orgList: "/org",
  orgAdd: "/org/create",
  orgView: "/org/:orgHandle",
  orgEdit: "/org/:orgHandle/edit",
  orgLeave: "/org/:orgHandle/leave",
  orgRemove: "/org/:orgHandle/remove",
} as const satisfies Record<PageNameOrg, string>
