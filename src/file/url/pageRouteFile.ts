import type { PageNameFile } from "#src/file/url/pageNameFile.ts"

export type PageRouteFile = keyof typeof pageRouteFile

export const pageRouteFile = {
  resourceFileAdd: "/resources/:resourceId/files",
  resourceFileEdit: "/resources/:resourceId/:fileId/edit",
  resourceFileRemove: "/resources/:resourceId/:fileId/remove",
} as const satisfies Record<PageNameFile, string>
