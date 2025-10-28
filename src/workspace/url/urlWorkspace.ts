import { pageRouteWorkspace } from "@/workspace/url/pageRouteWorkspace"

export function urlWorkspaceList() {
  return pageRouteWorkspace.workspaceList
}

export function urlWorkspaceAdd() {
  return pageRouteWorkspace.workspaceAdd
}

export function urlWorkspaceView(workspaceHandle: string) {
  return replaceWorkspaceHandle(pageRouteWorkspace.workspaceView, workspaceHandle)
}

export function urlWorkspaceEdit(workspaceHandle: string) {
  return replaceWorkspaceHandle(pageRouteWorkspace.workspaceEdit, workspaceHandle)
}

export function urlWorkspaceRemove(workspaceHandle: string) {
  return replaceWorkspaceHandle(pageRouteWorkspace.workspaceRemove, workspaceHandle)
}

function replaceWorkspaceHandle(url: string, workspaceHandle: string) {
  return url.replace(":workspaceHandle", workspaceHandle)
}
