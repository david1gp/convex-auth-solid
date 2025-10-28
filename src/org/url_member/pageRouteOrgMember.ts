import type { PageNameOrgMember } from "@/org/url_member/pageNameOrgMember"

export type PageRouteOrgMember = keyof typeof pageRouteOrgMember

export const pageRouteOrgMember = {
  orgMemberList: "/w/:orgHandle/members",
  orgMemberAdd: "/w/:orgHandle/members/add",
  orgMemberView: "/w/:orgHandle/members/:memberId/view",
  orgMemberEdit: "/w/:orgHandle/members/:memberId/edit",
  orgMemberRemove: "/w/:orgHandle/members/:memberId/remove",
} as const satisfies Record<PageNameOrgMember, string>
