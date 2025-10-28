import type { PageNameWorkspace } from "@/workspace/url/pageNameWorkspace"

export type PageRouteWorkspace = keyof typeof pageRouteWorkspace

export const pageRouteWorkspace = {
  workspaceList: "/w/list",
  workspaceAdd: "/w/add",
  workspaceView: "/w/:workspaceHandle/view",
  workspaceEdit: "/w/:workspaceHandle/edit",
  workspaceRemove: "/w/:workspaceHandle/remove",
} as const satisfies Record<PageNameWorkspace, string>
