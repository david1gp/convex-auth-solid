import { getBaseUrlSignedIn } from "@/app/url/getBaseUrl"
import { pagePathIsAuth } from "@/auth/url/pagePathIsAuth"

export function urlSignInRedirectUrl(fromPathname: string | null | undefined = window.document.location.pathname) {
  const defaultUrl = getBaseUrlSignedIn()
  if (!fromPathname || fromPathname === "/" || pagePathIsAuth(fromPathname)) {
    return defaultUrl
  }
  return fromPathname
}
