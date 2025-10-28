import { pageRouteWorkspace } from "@/workspace/url/pageRouteWorkspace"

export function urlWorkspaceList() {
  return pageRouteWorkspace.workspaceList
}

export function urlWorkspaceAdd() {
  return pageRouteWorkspace.workspaceAdd
}

export function urlWorkspaceView(slug: string) {
  return pageRouteWorkspace.workspaceView.replace(":slug", slug)
}

export function urlWorkspaceEdit(slug: string) {
  return pageRouteWorkspace.workspaceEdit.replace(":slug", slug)
}

export function urlWorkspaceRemove(slug: string) {
  return pageRouteWorkspace.workspaceRemove.replace(":slug", slug)
}
