import { pageNameAuth, type PageNameAuth } from "./pageNameAuth"
import { pageRouteAuth } from "./pageRouteAuth"

export function pagePathIsAuth(urlPath: string) {
  for (const key in Object.keys(pageNameAuth)) {
    if (urlPath === pageRouteAuth[key as PageNameAuth]) {
      return true
    }
  }
  return false
}
