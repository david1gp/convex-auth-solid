import type { Language } from "@/app/i18n/language"
import { pageRouteResource } from "@/resource/url/pageRouteResource"
import { stringReplaceParam1 } from "@/utils/text/stringReplaceParam1"

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
