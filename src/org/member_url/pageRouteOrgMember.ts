import type { PageNameOrgMember } from "#src/org/member_url/pageNameOrgMember.ts"

export type PageRouteOrgMember = keyof typeof pageRouteOrgMember

export const pageRouteOrgMember = {
  orgMemberList: "/org/:orgHandle/members",
  orgMemberAdd: "/org/:orgHandle/members/add",
  orgMemberView: "/org/:orgHandle/members/:memberId/view",
  orgMemberEdit: "/org/:orgHandle/members/:memberId/edit",
  orgMemberRemove: "/org/:orgHandle/members/:memberId/remove",
} as const satisfies Record<PageNameOrgMember, string>
