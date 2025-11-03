import { pageRouteOrgInvitation } from "@/org/invitation_url/pageRouteOrgInvitation"

export function urlOrgInvitationList(orgHandle: string): string {
  return pageRouteOrgInvitation.orgInvitationList.replace(":orgHandle", orgHandle)
}

export function urlOrgInvitationAdd(orgHandle: string): string {
  return pageRouteOrgInvitation.orgInvitationAdd.replace(":orgHandle", orgHandle)
}

export function urlOrgInvitationAccept(orgHandle: string, invitationCode: string): string {
  return pageRouteOrgInvitation.orgInvitationAccept
    .replace(":orgHandle", orgHandle)
    .replace(":invitationCode", invitationCode)
}
