import { pageRouteAuth } from "~auth/url/pageRouteAuth"
import { serializeUrlParams } from "~utils/url/serializeUrlParams"


export function urlSignUpConfirmEmail(email: string, code: string, returnPath?: string) {
  const obj: Record<string, string> = { email, code }
  if (returnPath) {
    obj.returnPath = returnPath
  }
  return `${pageRouteAuth.signUpConfirmEmail}?${serializeUrlParams(obj)}`
}
