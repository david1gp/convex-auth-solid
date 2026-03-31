import type { Language } from "#src/app/i18n/language.ts"
import { pageRouteResource } from "#src/resource/url/pageRouteResource.ts"
import { stringReplaceParam1 } from "#src/utils/text/stringReplaceParam1.ts"

export function urlResourceList() {
  return pageRouteResource.resourceList
}

export function urlResourceAdd() {
  return pageRouteResource.resourceAdd
}

export function urlResourceView(resourceId: string) {
  return stringReplaceParam1(pageRouteResource.resourceView, "resourceId", resourceId)
}

export function urlResourceEdit(resourceId: string) {
  return stringReplaceParam1(pageRouteResource.resourceEdit, "resourceId", resourceId)
}

export function urlResourceRemove(resourceId: string) {
  return stringReplaceParam1(pageRouteResource.resourceRemove, "resourceId", resourceId)
}

export function urlResourceSiteList(l: Language): string {
  return `/resources-${l}`
}

export function urlResourceSiteView(l: Language, resourceId: string) {
  return `/resources-${l}/` + resourceId
}
