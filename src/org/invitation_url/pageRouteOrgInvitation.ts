import type { PageNameOrgInvitation } from "#src/org/invitation_url/pageNameOrgInvitation.ts"

export type PageRouteOrgInvitation = keyof typeof pageRouteOrgInvitation

export const pageRouteOrgInvitation = {
  orgInvitationList: "/org/:orgHandle/invitations",
  orgInvitationAdd: "/org/:orgHandle/invitations/add",
  orgInvitationAccept: "/org/:orgHandle/invitations/:invitationCode/accept",
} as const satisfies Record<PageNameOrgInvitation, string>
