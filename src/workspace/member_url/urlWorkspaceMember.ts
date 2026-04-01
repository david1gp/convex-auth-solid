import { pageRouteWorkspaceMember } from "#src/workspace/member_url/pageRouteWorkspaceMember.ts"

export function urlWorkspaceMemberList(workspaceHandle: string) {
  return replaceWorkspaceHandle(pageRouteWorkspaceMember.workspaceMemberList, workspaceHandle)
}

export function urlWorkspaceMemberAdd(workspaceHandle: string) {
  return replaceWorkspaceHandle(pageRouteWorkspaceMember.workspaceMemberAdd, workspaceHandle)
}

export function urlWorkspaceMemberEdit(workspaceHandle: string, memberId: string) {
  return replaceHandles(pageRouteWorkspaceMember.workspaceMemberEdit, workspaceHandle, memberId)
}

export function urlWorkspaceMemberDelete(workspaceHandle: string, memberId: string) {
  return replaceHandles(pageRouteWorkspaceMember.workspaceMemberDelete, workspaceHandle, memberId)
}

function replaceHandles(url: string, workspaceHandle: string, memberId: string) {
  return url.replace(":workspaceHandle", workspaceHandle).replace(":memberId", memberId)
}

function replaceWorkspaceHandle(url: string, handle: string) {
  return url.replace(":workspaceHandle", handle)
}

function replaceMemberId(url: string, memberId: string) {
  return url.replace(":memberId", memberId)
}