import { pageRouteOrg } from "@/org/url/pageRouteOrg"

export function urlOrgList() {
  return pageRouteOrg.orgList
}

export function urlOrgAdd() {
  return pageRouteOrg.orgAdd
}

export function urlOrgView(slug: string) {
  return pageRouteOrg.orgView.replace(":slug", slug)
}

export function urlOrgEdit(slug: string) {
  return pageRouteOrg.orgEdit.replace(":slug", slug)
}

export function urlOrgRemove(slug: string) {
  return pageRouteOrg.orgRemove.replace(":slug", slug)
}
