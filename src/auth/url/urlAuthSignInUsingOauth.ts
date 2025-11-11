import { envBaseUrlApiResult } from "@/app/env/public/envBaseUrlApiResult"

export function urlAuthSignInUsingOauth(provider: string) {
  const r = envBaseUrlApiResult()
  if (!r.success) {
    console.error(r.errorMessage)
    return ""
  }
  return `${`${r.data}/api/auth`}/${provider}`
}
