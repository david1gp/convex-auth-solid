export type PageNameWorkspace = keyof typeof pageNameWorkspace

export const pageNameWorkspace = {
  workspaceList: "workspaceList",
  workspaceAdd: "workspaceAdd",
  workspaceView: "workspaceView",
  workspaceEdit: "workspaceEdit",
  workspaceRemove: "workspaceRemove",
} as const
