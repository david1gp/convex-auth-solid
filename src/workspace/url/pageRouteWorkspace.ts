import type { PageNameWorkspace } from "@/workspace/url/pageNameWorkspace"

export type PageRouteWorkspace = keyof typeof pageRouteWorkspace

export const pageRouteWorkspace = {
  workspaceList: "/w/list",
  workspaceAdd: "/w/add",
  workspaceView: "/w/:slug/view",
  workspaceEdit: "/w/:slug/edit",
  workspaceRemove: "/w/:slug/remove",
} as const satisfies Record<PageNameWorkspace, string>
