import type { PageNameOrgInvitation } from "@/org/invitation_url/pageNameOrgInvitation"

export type PageRouteOrgInvitation = keyof typeof pageRouteOrgInvitation

export const pageRouteOrgInvitation = {
  orgInvitationList: "/w/:orgHandle/invitations",
  orgInvitationAdd: "/w/:orgHandle/invitations/add",
  orgInvitationAccept: "/w/:orgHandle/invitations/:invitationCode/accept",
} as const satisfies Record<PageNameOrgInvitation, string>
