import { pageRouteAuth } from "@/auth/url/pageRouteAuth"
import { serializeUrlParams } from "~utils/url/serializeUrlParams"

export function urlSignInEnterOtp(email: string, code?: string, returnPath?: string) {
  const obj: Record<string, string> = { email }
  if (code) {
    obj.code = code
  }
  if (returnPath) {
    obj.returnPath = returnPath
  }
  return `${pageRouteAuth.signInEnterOtp}?${serializeUrlParams(obj)}`
}
