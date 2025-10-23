import { getDefaultUrlSignedIn } from "@/auth/url/getDefaultUrlSignedIn"
import { pagePathIsAuth } from "@/auth/url/pagePathIsAuth"

export function urlSignInRedirectUrl(fromPathname: string | null | undefined = location.pathname) {
  const defaultUrl = getDefaultUrlSignedIn()
  if (!fromPathname || pagePathIsAuth(fromPathname)) {
    return defaultUrl
  }
  return fromPathname
}
