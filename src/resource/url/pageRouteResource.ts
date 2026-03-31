import type { PageNameResource } from "#src/resource/url/pageNameResource.ts"

export type PageRouteResource = keyof typeof pageRouteResource

export const pageRouteResource = {
  resourceList: "/resources",
  resourceAdd: "/resources/add",
  resourceView: "/resources/:resourceId",
  resourceEdit: "/resources/:resourceId/edit",
  resourceRemove: "/resources/:resourceId/remove",
} as const satisfies Record<PageNameResource, string>
