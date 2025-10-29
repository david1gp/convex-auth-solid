import type { PageNameOrgInvitation } from "@/org/url_invitation/pageNameOrgInvitation"

export type PageRouteOrgMember = keyof typeof pageRouteOrgInvitation

export const pageRouteOrgInvitation = {
  orgInvitationList: "/w/:orgHandle/invitations",
  orgInvitationAdd: "/w/:orgHandle/invitations/add",
  orgInvitationView: "/w/:orgHandle/invitations/:invitationCode/view",
} as const satisfies Record<PageNameOrgInvitation, string>
