import type { PageNameWorkspace } from "#src/workspace/url/pageNameWorkspace.js"

export type PageRouteWorkspace = keyof typeof pageRouteWorkspace

export const pageRouteWorkspace = {
  workspaceList: "/w/list",
  workspaceAdd: "/w/add",
  workspaceView: "/w/:workspaceHandle/view",
  workspaceEdit: "/w/:workspaceHandle/edit",
  workspaceRemove: "/w/:workspaceHandle/remove",
} as const satisfies Record<PageNameWorkspace, string>
