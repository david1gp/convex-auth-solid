import { pageRouteOrgMember } from "@/org/member_url/pageRouteOrgMember"

export function urlOrgMemberList(orgHandle: string) {
  return replaceOrgHandle(pageRouteOrgMember.orgMemberList, orgHandle)
}

export function urlOrgMemberAdd(orgHandle: string) {
  return replaceOrgHandle(pageRouteOrgMember.orgMemberAdd, orgHandle)
}

export function urlOrgMemberView(orgHandle: string, memberId: string) {
  return replaceHandles(pageRouteOrgMember.orgMemberView, orgHandle, memberId)
}

export function urlOrgMemberEdit(orgHandle: string, memberId: string) {
  return replaceHandles(pageRouteOrgMember.orgMemberEdit, orgHandle, memberId)
}

export function urlOrgMemberRemove(orgHandle: string, memberId: string) {
  return replaceHandles(pageRouteOrgMember.orgMemberRemove, orgHandle, memberId)
}

function replaceHandles(url: string, orgHandle: string, memberId: string) {
  return url.replace(":orgHandle", orgHandle).replace(":memberId", memberId)
}

function replaceOrgHandle(url: string, handle: string) {
  return url.replace(":orgHandle", handle)
}

function replaceMemberId(url: string, memberId: string) {
  return url.replace(":memberId", memberId)
}
