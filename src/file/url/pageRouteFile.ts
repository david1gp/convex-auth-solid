import type { PageNameFile } from "@/file/url/pageNameFile"

export type PageRouteFile = keyof typeof pageRouteFile

export const pageRouteFile = {
  resourceFileAdd: "/resources/:resourceId/files",
  resourceFileEdit: "/resources/:resourceId/:fileId/edit",
  resourceFileRemove: "/resources/:resourceId/:fileId/remove",
} as const satisfies Record<PageNameFile, string>
