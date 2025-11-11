import type { PageNameOrgMember } from "@/org/member_url/pageNameOrgMember"

export type PageRouteOrgMember = keyof typeof pageRouteOrgMember

export const pageRouteOrgMember = {
  orgMemberList: "/organizations/:orgHandle/members",
  orgMemberAdd: "/organizations/:orgHandle/members/add",
  orgMemberView: "/organizations/:orgHandle/members/:memberId/view",
  orgMemberEdit: "/organizations/:orgHandle/members/:memberId/edit",
  orgMemberRemove: "/organizations/:orgHandle/members/:memberId/remove",
} as const satisfies Record<PageNameOrgMember, string>
