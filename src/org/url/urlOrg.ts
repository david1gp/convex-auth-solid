import { pageRouteOrg } from "@/org/url/pageRouteOrg"

export function urlOrgList() {
  return pageRouteOrg.orgList
}

export function urlOrgAdd() {
  return pageRouteOrg.orgAdd
}

export function urlOrgView(handle: string) {
  return replaceOrgHandle(pageRouteOrg.orgView, handle)
}

export function urlOrgEdit(handle: string) {
  return replaceOrgHandle(pageRouteOrg.orgEdit, handle)
}

export function urlOrgRemove(handle: string) {
  return replaceOrgHandle(pageRouteOrg.orgRemove, handle)
}

function replaceOrgHandle(url: string, handle: string) {
  return url.replace(":orgHandle", handle)
}
