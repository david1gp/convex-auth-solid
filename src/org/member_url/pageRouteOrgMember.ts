import type { PageNameOrgMember } from "@/org/member_url/pageNameOrgMember"

export type PageRouteOrgMember = keyof typeof pageRouteOrgMember

export const pageRouteOrgMember = {
  orgMemberList: "/stakeholders/:orgHandle/members",
  orgMemberAdd: "/stakeholders/:orgHandle/members/add",
  orgMemberView: "/stakeholders/:orgHandle/members/:memberId/view",
  orgMemberEdit: "/stakeholders/:orgHandle/members/:memberId/edit",
  orgMemberRemove: "/stakeholders/:orgHandle/members/:memberId/remove",
} as const satisfies Record<PageNameOrgMember, string>
