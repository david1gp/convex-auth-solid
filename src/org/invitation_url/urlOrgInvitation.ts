import { pageRouteOrgInvitation } from "@/org/invitation_url/pageRouteOrgInvitation"

export function urlOrgInvitationList(orgHandle: string): string {
  return pageRouteOrgInvitation.orgInvitationList.replace(":orgHandle", orgHandle)
}

export function urlOrgInvitationAdd(orgHandle: string): string {
  return pageRouteOrgInvitation.orgInvitationAdd.replace(":orgHandle", orgHandle)
}

export function urlOrgInvitationView(orgHandle: string, invitationCode: string): string {
  return pageRouteOrgInvitation.orgInvitationView
    .replace(":orgHandle", orgHandle)
    .replace(":invitationCode", invitationCode)
}
