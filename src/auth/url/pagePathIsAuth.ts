import { pageRouteAuth } from "./pageRouteAuth"

export function pagePathIsAuth(urlPath: string) {
  return Object.values(pageRouteAuth).find((p) => p === urlPath)
}
