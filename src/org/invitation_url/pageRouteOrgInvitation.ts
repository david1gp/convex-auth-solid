import type { PageNameOrgInvitation } from "@/org/invitation_url/pageNameOrgInvitation"

export type PageRouteOrgInvitation = keyof typeof pageRouteOrgInvitation

export const pageRouteOrgInvitation = {
  orgInvitationList: "/organizations/:orgHandle/invitations",
  orgInvitationAdd: "/organizations/:orgHandle/invitations/add",
  orgInvitationAccept: "/organizations/:orgHandle/invitations/:invitationCode/accept",
} as const satisfies Record<PageNameOrgInvitation, string>
