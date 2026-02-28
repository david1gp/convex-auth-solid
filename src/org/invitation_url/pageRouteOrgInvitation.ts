import type { PageNameOrgInvitation } from "@/org/invitation_url/pageNameOrgInvitation"

export type PageRouteOrgInvitation = keyof typeof pageRouteOrgInvitation

export const pageRouteOrgInvitation = {
  orgInvitationList: "/stakeholders/:orgHandle/invitations",
  orgInvitationAdd: "/stakeholders/:orgHandle/invitations/add",
  orgInvitationAccept: "/stakeholders/:orgHandle/invitations/:invitationCode/accept",
} as const satisfies Record<PageNameOrgInvitation, string>
